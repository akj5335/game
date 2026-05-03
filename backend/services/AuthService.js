const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

exports.registerUser = async (userData) => {
  // Note: Supabase handles user creation in auth.users.
  // This service should only handle profile updates or business logic.
  const { id, name, phoneNumber, inviteCode } = userData;

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      name,
      phone_number: phoneNumber,
      invite_code: Math.random().toString(36).substring(2, 10).toUpperCase()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  // Reward referrer
  if (inviteCode) {
    const { data: referrer, error: refError } = await supabase
      .from('profiles')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (referrer && !refError) {
      await supabase.rpc('increment_wallet', { 
        user_id: referrer.id, 
        amount: 10.00 
      });
      
      await supabase
        .from('profiles')
        .update({ referral_count: referrer.referral_count + 1 })
        .eq('id', referrer.id);
    }
  }

  return { user: profile };
};

exports.getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('User not found', 404);
  }
  return data;
};
