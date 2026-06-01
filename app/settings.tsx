import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [highQuality, setHighQuality] = React.useState(false);

  return (
    <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <Pressable style={[styles.menuItem, styles.menuItemBorder]}>
              <IconSymbol name="person.fill" size={18} color="#B3B3B3" />
              <Text style={styles.menuLabel}>Edit Profile</Text>
              <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
            </Pressable>
            <Pressable style={[styles.menuItem, styles.menuItemBorder]}>
              <IconSymbol name="dollarsign.circle.fill" size={18} color="#FFD700" />
              <Text style={styles.menuLabel}>Subscription Plan</Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
            </Pressable>
            <Pressable style={styles.menuItem}>
              <IconSymbol name="lock.fill" size={18} color="#B3B3B3" />
              <Text style={styles.menuLabel}>Privacy & Security</Text>
              <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
            </Pressable>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <View style={[styles.menuItem, styles.menuItemBorder]}>
              <IconSymbol name="bell.fill" size={18} color="#B3B3B3" />
              <Text style={styles.menuLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#333333', true: '#1DB954' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.menuItem, styles.menuItemBorder]}>
              <IconSymbol name="play.fill" size={18} color="#B3B3B3" />
              <Text style={styles.menuLabel}>Autoplay</Text>
              <Switch
                value={autoPlay}
                onValueChange={setAutoPlay}
                trackColor={{ false: '#333333', true: '#1DB954' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.menuItem}>
              <IconSymbol name="waveform" size={18} color="#B3B3B3" />
              <Text style={styles.menuLabel}>High Quality Audio</Text>
              <View style={styles.premiumTag}>
                <Text style={styles.premiumTagText}>PREMIUM</Text>
              </View>
              <Switch
                value={highQuality}
                onValueChange={setHighQuality}
                disabled
                trackColor={{ false: '#333333', true: '#1DB954' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.menuCard}>
            <Pressable style={[styles.menuItem, styles.menuItemBorder]}>
              <IconSymbol name="info.circle" size={18} color="#B3B3B3" />
              <Text style={styles.menuLabel}>About BELENTANI</Text>
              <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
            </Pressable>
            <View style={styles.menuItem}>
              <IconSymbol name="checkmark.circle.fill" size={18} color="#1DB954" />
              <Text style={styles.menuLabel}>Version</Text>
              <Text style={styles.menuValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: '#FFFFFF', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { color: '#B3B3B3', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  menuCard: { backgroundColor: '#1E1E1E', borderRadius: 14, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuItemBorder: { borderBottomWidth: 0.5, borderBottomColor: '#333333' },
  menuLabel: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  menuValue: { color: '#B3B3B3', fontSize: 14 },
  freeBadge: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeBadgeText: { color: '#B3B3B3', fontSize: 10, fontWeight: '700' },
  premiumTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumTagText: { color: '#121212', fontSize: 9, fontWeight: '700' },
});
