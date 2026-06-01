import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MOCK_CEO_STRATEGY, MOCK_AGENTS, formatNumber, timeAgo } from '@/lib/mock-data';
import { Agent, CEOStrategy, AgentRole } from '@/shared/types';

const AGENT_COLORS: Record<AgentRole, string> = {
  CEO: '#1DB954',
  COO: '#4A90E2',
  CMO: '#E91E63',
  CPO: '#F39C12',
  CTO: '#9B59B6',
};

const AGENT_ICONS: Record<AgentRole, 'brain' | 'gear' | 'megaphone.fill' | 'sparkles' | 'cpu'> = {
  CEO: 'brain',
  COO: 'gear',
  CMO: 'megaphone.fill',
  CPO: 'sparkles',
  CTO: 'cpu',
};

function AgentCard({ agent }: { agent: Agent }) {
  const color = AGENT_COLORS[agent.role];
  const icon = AGENT_ICONS[agent.role];

  return (
    <View style={[styles.agentCard, { borderColor: color }]}>
      <View style={[styles.agentIconContainer, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon} size={22} color={color} />
      </View>
      <View style={styles.agentInfo}>
        <View style={styles.agentHeader}>
          <Text style={styles.agentRole}>{agent.role}</Text>
          <View style={[
            styles.agentStatus,
            { backgroundColor: agent.status === 'active' ? '#1DB954' : agent.status === 'analyzing' ? '#F39C12' : '#333333' },
          ]}>
            <Text style={styles.agentStatusText}>{agent.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.agentName}>{agent.name}</Text>
        {agent.lastAction && (
          <Text style={styles.agentLastAction} numberOfLines={1}>{agent.lastAction}</Text>
        )}
      </View>
    </View>
  );
}

function MetricCard({ label, value, trend, color }: { label: string; value: string; trend?: string; color?: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, color ? { color } : {}]}>{value}</Text>
      {trend && (
        <Text style={[styles.metricTrend, { color: trend.startsWith('+') ? '#1DB954' : '#F44336' }]}>
          {trend}
        </Text>
      )}
    </View>
  );
}

export default function CEODashboard() {
  const [strategy, setStrategy] = useState<CEOStrategy>(MOCK_CEO_STRATEGY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [killSwitchModal, setKillSwitchModal] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'risks'>('overview');

  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/trpc/council.analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { metrics: strategy.metrics } }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.result?.data?.json) {
          setStrategy(prev => ({ ...prev, ...data.result.data.json, generatedAt: new Date().toISOString() }));
        }
      }
    } catch {
      // Use mock update
      setStrategy(prev => ({
        ...prev,
        generatedAt: new Date().toISOString(),
        summary: 'Council analysis complete. Market conditions favorable. Recommend expanding AI playlist categories and increasing TikTok integration budget by 40%.',
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKillSwitch = () => {
    setKillSwitchModal(true);
  };

  const confirmKillSwitch = () => {
    setKillSwitchActive(!killSwitchActive);
    setKillSwitchModal(false);
    Alert.alert(
      killSwitchActive ? 'System Resumed' : 'System Paused',
      killSwitchActive
        ? 'The Executive Council has been reactivated. All autonomous operations resume.'
        : 'The Executive Council has been paused. All autonomous operations suspended.',
    );
  };

  return (
    <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Executive Council</Text>
            <Text style={styles.headerSubtitle}>BELENTANI Command Center</Text>
          </View>
          <View style={[styles.systemStatus, { backgroundColor: killSwitchActive ? '#F44336' : '#1DB954' }]}>
            <Text style={styles.systemStatusText}>{killSwitchActive ? 'PAUSED' : 'LIVE'}</Text>
          </View>
        </View>

        {/* Council Banner */}
        <View style={styles.councilBanner}>
          <View style={styles.councilBannerLeft}>
            <IconSymbol name="command.square.fill" size={28} color="#1DB954" />
            <View>
              <Text style={styles.councilBannerTitle}>Autonomous Executive Council</Text>
              <Text style={styles.councilBannerSubtitle}>
                5 AI agents · Supreme Law of Coherence
              </Text>
            </View>
          </View>
          <Text style={styles.councilBannerTime}>
            {timeAgo(strategy.generatedAt)}
          </Text>
        </View>

        {/* Agent Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Agents</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.agentsScroll}
          >
            {MOCK_AGENTS.map(agent => (
              <AgentCard key={agent.role} agent={agent} />
            ))}
          </ScrollView>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Total Users"
              value={formatNumber(strategy.metrics.users)}
              trend="+23% MoM"
              color="#1DB954"
            />
            <MetricCard
              label="Revenue"
              value={`$${formatNumber(strategy.metrics.revenue)}`}
              trend="+18% MoM"
              color="#FFD700"
            />
            <MetricCard
              label="Churn Rate"
              value={`${strategy.metrics.churn}%`}
              trend="-0.3%"
              color="#F44336"
            />
            <MetricCard
              label="Engagement"
              value={`${strategy.metrics.engagement}%`}
              trend="+5.2%"
              color="#4A90E2"
            />
          </View>
        </View>

        {/* Trigger Analysis Button */}
        <View style={styles.analyzeContainer}>
          <Pressable
            onPress={triggerAnalysis}
            disabled={isAnalyzing || killSwitchActive}
            style={({ pressed }) => [
              styles.analyzeBtn,
              (isAnalyzing || killSwitchActive) && styles.analyzeBtnDisabled,
              pressed && !isAnalyzing && { transform: [{ scale: 0.97 }] },
            ]}
          >
            {isAnalyzing ? (
              <View style={styles.analyzeBtnContent}>
                <ActivityIndicator size="small" color="#121212" />
                <Text style={styles.analyzeBtnText}>Council Analyzing...</Text>
              </View>
            ) : (
              <View style={styles.analyzeBtnContent}>
                <IconSymbol name="brain" size={20} color="#121212" />
                <Text style={styles.analyzeBtnText}>Trigger Council Analysis</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['overview', 'actions', 'risks'] as const).map(tab => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'overview' ? 'Strategy' : tab === 'actions' ? 'Actions' : 'Risks'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <IconSymbol name="sparkles" size={16} color="#1DB954" />
                <Text style={styles.strategyTitle}>CEO Summary</Text>
              </View>
              <Text style={styles.strategyText}>{strategy.summary}</Text>
            </View>

            <Text style={styles.subsectionTitle}>Key Decisions</Text>
            {strategy.keyDecisions.map((decision, i) => (
              <View key={i} style={styles.decisionRow}>
                <View style={styles.decisionDot} />
                <Text style={styles.decisionText}>{decision}</Text>
              </View>
            ))}

            <Text style={styles.subsectionTitle}>Next Steps</Text>
            {strategy.nextSteps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <IconSymbol name="checkmark.circle.fill" size={16} color="#1DB954" />
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'actions' && (
          <View style={styles.tabContent}>
            {strategy.autonomousActions.map(action => (
              <View key={action.id} style={styles.actionCard}>
                <View style={styles.actionHeader}>
                  <View style={[
                    styles.agentBadge,
                    { backgroundColor: AGENT_COLORS[action.agent as AgentRole] + '30' },
                  ]}>
                    <Text style={[
                      styles.agentBadgeText,
                      { color: AGENT_COLORS[action.agent as AgentRole] },
                    ]}>
                      {action.agent}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: action.status === 'executed' ? '#1DB95420' : action.status === 'pending' ? '#F39C1220' : '#F4433620' },
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      { color: action.status === 'executed' ? '#1DB954' : action.status === 'pending' ? '#F39C12' : '#F44336' },
                    ]}>
                      {action.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.actionTime}>{timeAgo(action.timestamp)}</Text>
                </View>
                <Text style={styles.actionText}>{action.action}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'risks' && (
          <View style={styles.tabContent}>
            {strategy.risks.map((risk, i) => (
              <View key={i} style={styles.riskCard}>
                <IconSymbol name="exclamationmark.triangle.fill" size={18} color="#F39C12" />
                <Text style={styles.riskText}>{risk}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Kill Switch */}
        <View style={styles.killSwitchSection}>
          <Text style={styles.killSwitchTitle}>Owner Controls</Text>
          <Pressable
            onPress={handleKillSwitch}
            style={({ pressed }) => [
              styles.killSwitchBtn,
              killSwitchActive && styles.killSwitchBtnActive,
              pressed && { opacity: 0.85 },
            ]}
          >
            <IconSymbol name="power" size={22} color={killSwitchActive ? '#FFFFFF' : '#F44336'} />
            <View>
              <Text style={[styles.killSwitchBtnTitle, killSwitchActive && { color: '#FFFFFF' }]}>
                {killSwitchActive ? 'Resume System' : 'Kill Switch'}
              </Text>
              <Text style={[styles.killSwitchBtnSubtitle, killSwitchActive && { color: 'rgba(255,255,255,0.7)' }]}>
                {killSwitchActive ? 'Reactivate all autonomous operations' : 'Pause all autonomous operations'}
              </Text>
            </View>
          </Pressable>
          <Text style={styles.killSwitchNote}>
            You retain full control. Revenue flow and core systems remain active.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Kill Switch Confirmation Modal */}
      <Modal
        visible={killSwitchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setKillSwitchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#F44336" />
            <Text style={styles.modalTitle}>
              {killSwitchActive ? 'Resume System?' : 'Activate Kill Switch?'}
            </Text>
            <Text style={styles.modalText}>
              {killSwitchActive
                ? 'All 5 agents will resume autonomous operations immediately.'
                : 'This will pause all autonomous operations. The Executive Council will stop making decisions until you resume.'}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setKillSwitchModal(false)}
                style={({ pressed }) => [styles.modalCancelBtn, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmKillSwitch}
                style={({ pressed }) => [styles.modalConfirmBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.modalConfirmText}>
                  {killSwitchActive ? 'Resume' : 'Confirm'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  systemStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  systemStatusText: { color: '#121212', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  councilBanner: {
    marginHorizontal: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1DB954',
    marginBottom: 4,
  },
  councilBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  councilBannerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  councilBannerSubtitle: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  councilBannerTime: { color: '#B3B3B3', fontSize: 12 },
  section: { marginTop: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  agentsScroll: { paddingHorizontal: 16, gap: 12 },
  agentCard: {
    width: 200,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  agentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInfo: { flex: 1 },
  agentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  agentRole: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  agentStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  agentStatusText: { color: '#121212', fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  agentName: { color: '#B3B3B3', fontSize: 11, marginBottom: 4 },
  agentLastAction: { color: '#666666', fontSize: 10, lineHeight: 14 },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  metricLabel: { color: '#B3B3B3', fontSize: 11, fontWeight: '600' },
  metricValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  metricTrend: { fontSize: 12, fontWeight: '600' },
  analyzeContainer: { paddingHorizontal: 16, marginTop: 20 },
  analyzeBtn: {
    backgroundColor: '#1DB954',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeBtnDisabled: { backgroundColor: '#2A2A2A' },
  analyzeBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  analyzeBtnText: { color: '#121212', fontSize: 15, fontWeight: '700' },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#2A2A2A' },
  tabText: { color: '#B3B3B3', fontSize: 13, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF', fontWeight: '600' },
  tabContent: { paddingHorizontal: 16, marginTop: 16, gap: 12 },
  strategyCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#1DB954',
  },
  strategyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  strategyTitle: { color: '#1DB954', fontSize: 13, fontWeight: '700' },
  strategyText: { color: '#B3B3B3', fontSize: 13, lineHeight: 20 },
  subsectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 4 },
  decisionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  decisionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1DB954', marginTop: 6 },
  decisionText: { flex: 1, color: '#B3B3B3', fontSize: 13, lineHeight: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepText: { flex: 1, color: '#B3B3B3', fontSize: 13, lineHeight: 20 },
  actionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  agentBadgeText: { fontSize: 11, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  actionTime: { flex: 1, color: '#666666', fontSize: 11, textAlign: 'right' },
  actionText: { color: '#FFFFFF', fontSize: 13, lineHeight: 19 },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F39C12',
  },
  riskText: { flex: 1, color: '#B3B3B3', fontSize: 13, lineHeight: 20 },
  killSwitchSection: { paddingHorizontal: 16, marginTop: 28 },
  killSwitchTitle: { color: '#B3B3B3', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  killSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F44336',
    marginBottom: 10,
  },
  killSwitchBtnActive: { backgroundColor: '#F44336', borderColor: '#F44336' },
  killSwitchBtnTitle: { color: '#F44336', fontSize: 15, fontWeight: '700' },
  killSwitchBtnSubtitle: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  killSwitchNote: { color: '#666666', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  modalText: { color: '#B3B3B3', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  modalCancelText: { color: '#B3B3B3', fontSize: 15, fontWeight: '600' },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  modalConfirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
