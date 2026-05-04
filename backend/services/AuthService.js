const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

exports.registerUser = async (userData) => {
  const { name, phoneNumber, password, inviteCode } = userData;
  const email = `${phoneNumber}@neonplay.com`;

  // 1. Create user in Supabase Auth using Admin API (auto-confirms)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, phone_number: phoneNumber }
  });

  if (authError || !authData?.user) {
    if (authError?.message?.includes('already registered')) {
      throw new AppError('User with this phone number already exists', 400);
    }
    throw new AppError(authError?.message || 'Failed to create user account', 400);
  }

  const userId = authData.user.id;
  if (!userId || userId === 'undefined') {
    throw new AppError('Generated User ID is invalid', 500);
  }

  // 2. Update the profile (profile is created by a DB trigger on auth.users usually, but we ensure it's updated)
  // We use .update because a trigger usually inserts a blank profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      name,
      phone_number: phoneNumber,
      invite_code: Math.random().toString(36).substring(2, 10).toUpperCase()
    })
    .eq('id', userId)
    .select()
    .single();

  if (profileError) {
    // If update fails, maybe the trigger hasn't run yet? We can try upsert
    const { data: upsertData, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name,
        phone_number: phoneNumber,
        invite_code: Math.random().toString(36).substring(2, 10).toUpperCase()
      })
      .select()
      .single();
      
    if (upsertError) throw new AppError(upsertError.message, 400);
  }

  // 3. Handle Referral
  if (inviteCode && inviteCode !== 'undefined' && inviteCode.trim() !== '') {
    const { data: referrer, error: refError } = await supabase
      .from('profiles')
      .select('*')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .single();

    if (referrer && !refError) {
      await supabase.rpc('increment_wallet', { 
        user_id: referrer.id, 
        amount: 10.00 
      });
      
      await supabase
        .from('profiles')
        .update({ referral_count: (referrer.referral_count || 0) + 1 })
        .eq('id', referrer.id);
    }
  }

  // 4. Sign in to get a token (since admin.createUser doesn't return a session token)
  const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (sessionError || !sessionData?.session?.access_token) {
    throw new AppError('Registration successful, but session generation failed.', 500);
  }

  return { 
    user: { ...authData.user, ...profile },
    token: sessionData.session.access_token 
  };
};

exports.loginUser = async (phoneNumber, password) => {
  const email = `${phoneNumber}@neonplay.com`;

  // Sign in via Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new AppError('Invalid credentials or user not found', 401);
  }

  // Fetch full profile
  const profile = await this.getUserProfile(data.user.id);

  return {
    user: { ...data.user, ...profile },
    token: data.session.access_token
  };
};

exports.getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('User profile not found', 404);
  }
  return data;
};
