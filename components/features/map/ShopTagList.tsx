// components/features/map/ShopTagList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SkeletonBox } from '@/components/ui/SkeletonBox';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { fetchShopReviewTags } from '@/api/review';
import { REVIEW_TAG_EMOJI } from '@/constants/reviewTags';
import { AppColors } from '@/constants/theme';

const PAGE_SIZE = 5;

interface TagItem {
  label: string;
  displayCount: number;
}

interface Props {
  shopId: string;
  // compact(홈탭): 상위 5개 + 리뷰탭 이동 버튼
  // expandable(리뷰탭): 5개씩 펼치기 / 접기
  mode?: 'compact' | 'expandable';
  onPressMore?: () => void; // compact 모드 전용
}

const ShopTagList = ({ shopId, mode = 'compact', onPressMore }: Props) => {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setIsLoading(true);
    fetchShopReviewTags(shopId).then((res) => {
      setTags(res.items);
      setIsLoading(false);
    });
    setVisibleCount(PAGE_SIZE);
  }, [shopId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SkeletonBox key={i} height={48} borderRadius={12} style={styles.skeletonRow} />
        ))}
      </View>
    );
  }

  if (tags.length === 0) return null;

  const visible = tags.slice(0, visibleCount);
  const hasMore = visibleCount < tags.length;
  const isExpanded = visibleCount > PAGE_SIZE;

  const handleExpand = () => setVisibleCount((v) => v + PAGE_SIZE);
  const handleCollapse = () => setVisibleCount(PAGE_SIZE);

  return (
    <View style={styles.container}>
      {visible.map((tag, index) => (
        <Animated.View
          key={tag.label}
          entering={FadeInDown.duration(200).delay(index * 30)}
          exiting={FadeOut.duration(150)}
          style={[styles.tagRow, index === 0 && styles.tagRowTop]}
        >
          <Text style={styles.emoji}>{REVIEW_TAG_EMOJI[tag.label] ?? '🏷️'}</Text>
          <Text style={[styles.label, index === 0 && styles.labelTop]}>
            {tag.label}
          </Text>
          <Text style={[styles.count, index === 0 && styles.countTop]}>
            {tag.displayCount}
          </Text>
        </Animated.View>
      ))}

      {mode === 'compact' && onPressMore && (
        <TouchableOpacity onPress={onPressMore} style={styles.moreRow}>
          <Text style={styles.moreText}>리뷰 탭에서 전체 보기 →</Text>
        </TouchableOpacity>
      )}

      {mode === 'expandable' && (
        <View style={styles.expandRow}>
          {hasMore && (
            <TouchableOpacity style={styles.expandBtn} onPress={handleExpand}>
              <Ionicons name="chevron-down" size={20} color={AppColors.primary} />
            </TouchableOpacity>
          )}
          {isExpanded && (
            <TouchableOpacity style={styles.collapseBtn} onPress={handleCollapse}>
              <Text style={styles.collapseText}>접기</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
  },
  tagRowTop: { backgroundColor: AppColors.primaryBgStrong },
  emoji: { fontSize: 22, marginRight: 12 },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: '#CC6600' },
  labelTop: { color: '#BF4F00' },
  count: { fontSize: 16, fontWeight: 'bold', color: AppColors.primary },
  countTop: { color: '#E65C00' },
  moreRow: { alignItems: 'flex-end', marginTop: 2 },
  moreText: { fontSize: 12, color: AppColors.primary },
  expandRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4, gap: 16 },
  expandBtn: { padding: 4 },
  collapseBtn: { padding: 4 },
  collapseText: { fontSize: 13, color: '#888' },
  skeleton: { backgroundColor: '#F0F0F0', height: 48 },
  skeletonTop: { backgroundColor: '#E8E8E8', height: 48 },
  skeletonRow: { marginBottom: 6 },
});

export default ShopTagList;
