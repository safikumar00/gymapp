import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Phone, Mail } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Member } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';

interface MemberCardProps {
  member: Member;
  onPress?: () => void;
}

export function MemberCard({ member, onPress }: MemberCardProps) {
  const statusColor =
    member.status === 'active'
      ? colors.success
      : member.status === 'expired'
        ? colors.error
        : colors.textSecondary;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={24} color={colors.white} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{member.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{member.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          {member.phone && (
            <View style={styles.detailRow}>
              <Phone size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{member.phone}</Text>
            </View>
          )}
          {member.email && (
            <View style={styles.detailRow}>
              <Mail size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{member.email}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.white,
    textTransform: 'capitalize',
  },
  details: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});
