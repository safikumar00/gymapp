import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { MemberCard } from '../../components/members/MemberCard';
import { fetchMembers, searchMembers } from '../../services/members.service';
import { useAuthStore } from '../../store/useAuthStore';
import { Member } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

export default function MembersListScreen() {
  const user = useAuthStore((state) => state.user);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMembers = async () => {
    if (!user?.gym_id) return;

    setLoading(true);
    const gymId = user.gym_id;

    if (searchQuery.trim()) {
      const { data } = await searchMembers(gymId, searchQuery);
      setMembers(data || []);
    } else {
      const { data } = await fetchMembers(gymId, 100, 0);
      setMembers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, [user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadMembers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No members found</Text>
      <Text style={styles.emptySubText}>
        {searchQuery
          ? 'Try a different search term'
          : 'Add your first member to get started'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberCard member={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMembers} />
        }
        ListEmptyComponent={renderEmpty}
      />
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
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
