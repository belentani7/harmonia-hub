import React from 'react';
import {
  View, Text, ScrollView, Pressable, Image, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MiniPlayer } from '@/components/mini-player';
import { usePlayer } from '@/lib/player-context';
import { useAuth } from '@/hooks/use-auth';

const STATS = [
  { label: 'Playlists', value: '12', icon: 'music.note.list' as const },
  { label: 'Hours', value: '247', icon: 'waveform' as const },
  { label: 'Streak', value: '14d', icon: 'bolt.fill' as const },
];

const MENU_ITEMS = [
  { icon: 'bell.fill' as const, label: 'Notifications', color: '#B3B3B3' },
  { icon: 'dollarsign.circle.fill' as const, label: 'Subscription', color: '#FFD700' },
  { icon: 'person.2.fill' as const, label: 'Artist Marketplace', color: '#4A90E2' },
  { icon: 'info.circle' as const, label: 'About BELENTANI', color: '#B3B3B3' },
];

export default function ProfileScreen() {
  const { currentTrack, openPlayer } = usePlayer();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <View style={styles.outerContainer}>
      <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Pressable
              onPress={() => router.push('/settings' as any)}
              style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}
            >
              <IconSymbol name="gear" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {isAuthenticated && user?.name ? user.name[0].toUpperCase() : 'B'}
                </Text>
              </View>
              <View style={styles.premiumBadge}>
                <IconSymbol name="crown.fill" size={10} color="#121212" />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {isAuthenticated && user?.name ? user.name : 'BELENTANI User'}
              </Text>
              <Text style={styles.userEmail}>
                {isAuthenticated && user?.email ? user.email : 'belentani7pedro@gmail.com'}
              </Text>
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>FREE TIER</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {STATS.map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <IconSymbol name={stat.icon} size={20} color="#1DB954" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Upgrade Banner */}
          <Pressable style={styles.upgradeBanner}>
            <View style={styles.upgradeContent}>
              <IconSymbol name="crown.fill" size={24} color="#FFD700" />
              <View>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeSubtitle}>Lyrics, downloads & more — from $4.99/mo</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={18} color="#FFD700" />
          </Pressable>

          {/* CEO Dashboard (Admin) */}
          <Pressable
            onPress={() => router.push('/ceo-dashboard' as any)}
            style={({ pressed }) => [styles.ceoButton, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.ceoButtonContent}>
              <View style={styles.ceoButtonIcon}>
                <IconSymbol name="command.square.fill" size={22} color="#121212" />
              </View>
              <View>
                <Text style={styles.ceoButtonTitle}>Executive Council</Text>
                <Text style={styles.ceoButtonSubtitle}>CEO Dashboard & Autonomous Agents</Text>
              </View>
            </View>
            <View style={styles.ceoButtonBadge}>
              <Text style={styles.ceoButtonBadgeText}>ADMIN</Text>
            </View>
          </Pressable>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <IconSymbol name={item.icon} size={20} color={item.color} />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
              </Pressable>
            ))}
          </View>

          {/* Sign Out / Sign In */}
          {isAuthenticated ? (
            <Pressable
              onPress={logout}
              style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.signInBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          )}

          {/* Version */}
          <Text style={styles.version}>BELENTANI v1.0.0 · Your AI Music OS</Text>

          <View style={{ height: currentTrack ? 80 : 32 }} />
        </ScrollView>
      </ScreenContainer>

      {currentTrack && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer onPress={openPlayer} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  settingsBtn: { padding: 4 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#121212', fontSize: 28, fontWeight: '800' },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  userInfo: { flex: 1, gap: 4 },
  userName: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  userEmail: { color: '#B3B3B3', fontSize: 13 },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tierText: { color: '#B3B3B3', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#B3B3B3', fontSize: 11 },
  upgradeBanner: {
    marginHorizontal: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    marginBottom: 12,
  },
  upgradeContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  upgradeTitle: { color: '#FFD700', fontSize: 15, fontWeight: '700' },
  upgradeSubtitle: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  ceoButton: {
    marginHorizontal: 20,
    backgroundColor: '#1DB954',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ceoButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ceoButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(18,18,18,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ceoButtonTitle: { color: '#121212', fontSize: 15, fontWeight: '700' },
  ceoButtonSubtitle: { color: 'rgba(18,18,18,0.7)', fontSize: 12, marginTop: 2 },
  ceoButtonBadge: {
    backgroundColor: 'rgba(18,18,18,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ceoButtonBadgeText: { color: '#121212', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  menuSection: {
    marginHorizontal: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
  },
  menuItemLabel: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  signOutBtn: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336',
    alignItems: 'center',
    marginBottom: 12,
  },
  signOutText: { color: '#F44336', fontSize: 15, fontWeight: '600' },
  signInBtn: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    marginBottom: 12,
  },
  signInText: { color: '#121212', fontSize: 15, fontWeight: '700' },
  version: { color: '#333333', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  miniPlayerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
