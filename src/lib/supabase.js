// src/lib/supabase.js
// -----------------------------------------------------------
// Supabase client + helper functions for auth, athletes,
// scores, and chats.
//
// SETUP:
//   1. npm install @supabase/supabase-js
//   2. Create a .env file in your project root:
//        VITE_SUPABASE_URL=https://your-project.supabase.co
//        VITE_SUPABASE_ANON_KEY=your-anon-key
//   3. Import helpers wherever you need them in your app.
// -----------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

// ── CLIENT ───────────────────────────────────────────────────

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)


// ══════════════════════════════════════════════════════════════
// AUTH  (username/password via Supabase Auth)
// Note: Supabase Auth uses email as the identifier.
// We store the chosen username in the user metadata.
// ══════════════════════════════════════════════════════════════

/**
 * Register a new user.
 * @param {string} username  - Display name stored in metadata
 * @param {string} email
 * @param {string} password
 */
export async function signUp(username, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) throw error
  return data
}

/**
 * Sign in with email + password.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get the currently logged-in user (or null).
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}


// ══════════════════════════════════════════════════════════════
// ATHLETES
// ══════════════════════════════════════════════════════════════

/**
 * Create an athlete profile for the current user.
 * @param {{ full_name, sport, team, bio, avatar_url }} profile
 */
export async function createAthlete(profile) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('athletes')
    .insert({ ...profile, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Get the athlete profile belonging to the current user.
 */
export async function getMyAthlete() {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('user_id', user.id)
    .single()
  if (error && error.code !== 'PGRST116') throw error // ignore "no rows"
  return data ?? null
}

/**
 * Update an athlete profile.
 * @param {string} athleteId
 * @param {object} updates
 */
export async function updateAthlete(athleteId, updates) {
  const { data, error } = await supabase
    .from('athletes')
    .update(updates)
    .eq('id', athleteId)
    .select()
    .single()
  if (error) throw error
  return data
}


// ══════════════════════════════════════════════════════════════
// SCORES
// ══════════════════════════════════════════════════════════════

/**
 * Add a score for an athlete.
 * @param {{ athlete_id, event_name, score, score_date?, notes? }} entry
 */
export async function addScore(entry) {
  const { data, error } = await supabase
    .from('scores')
    .insert(entry)
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Get all scores for a given athlete, newest first.
 * @param {string} athleteId
 */
export async function getScores(athleteId) {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('score_date', { ascending: false })
  if (error) throw error
  return data
}

/**
 * Delete a score by ID.
 * @param {string} scoreId
 */
export async function deleteScore(scoreId) {
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId)
  if (error) throw error
}


// ══════════════════════════════════════════════════════════════
// CHATS
// ══════════════════════════════════════════════════════════════

/**
 * Send a message to another user.
 * @param {string} receiverId  - UUID of the recipient
 * @param {string} message
 */
export async function sendMessage(receiverId, message) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('chats')
    .insert({ sender_id: user.id, receiver_id: receiverId, message })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Fetch conversation between current user and another user.
 * @param {string} otherUserId
 */
export async function getConversation(otherUserId) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

/**
 * Subscribe to new messages in real-time.
 * Returns the channel — call channel.unsubscribe() on cleanup.
 *
 * @param {string} otherUserId
 * @param {function} onMessage  - called with each new row
 */
export function subscribeToConversation(otherUserId, onMessage) {
  return supabase
    .channel('chats-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chats' },
      (payload) => {
        const msg = payload.new
        // Only fire for messages in this conversation
        if (
          (msg.sender_id === otherUserId || msg.receiver_id === otherUserId)
        ) {
          onMessage(msg)
        }
      }
    )
    .subscribe()
}

/**
 * Mark messages from a sender as read.
 * @param {string} senderId
 */
export async function markMessagesRead(senderId) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('chats')
    .update({ read: true })
    .eq('sender_id', senderId)
    .eq('receiver_id', user.id)
    .eq('read', false)
  if (error) throw error
}
