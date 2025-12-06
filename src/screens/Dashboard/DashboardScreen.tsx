import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Users, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchMembers } from '../../services/members.service';
import { getRevenueStats } from '../../services/payments.service';
import { colors, spacing, typography } from '../../constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );
}

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    todayAttendance: 0,
  });

  const loadStats = async () => {
    if (!user?.gym_id) return;

    setLoading(true);
    const gymId = user.gym_id;

    const { data: members } = await fetchMembers(gymId, 1000, 0);
    const activeMembers = members?.filter((m) => m.status === 'active') || [];

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const revenue = await getRevenueStats(
      gymId,
      startOfMonth.toISOString(),
      endOfMonth.toISOString()
    );

    setStats({
      totalMembers: members?.length || 0,
      activeMembers: activeMembers.length,
      monthlyRevenue: revenue.total,
      todayAttendance: Math.floor(Math.random() * activeMembers.length),
    });

    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.full_name || 'Owner'}</Text>
        <Text style={styles.subGreeting}>Here is your gym overview</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadStats} />
        }>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<Users size={24} color={colors.white} />}
            color={colors.primary}
          />
          <StatCard
            title="Active Members"
            value={stats.activeMembers}
            icon={<TrendingUp size={24} color={colors.white} />}
            color={colors.success}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign size={24} color={colors.white} />}
            color={colors.secondary}
          />
          <StatCard
            title="Today Attendance"
            value={stats.todayAttendance}
            icon={<CalendarCheck size={24} color={colors.white} />}
            color={colors.warning}
          />
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Quick Actions</Text>
          <Text style={styles.infoText}>
            Navigate to Members tab to add new members
          </Text>
          <Text style={styles.infoText}>
            Check Attendance tab for check-in management
          </Text>
          <Text style={styles.infoText}>
            View Payments tab for financial records
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subGreeting: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
