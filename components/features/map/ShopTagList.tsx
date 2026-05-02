// components/features/map/ShopTagList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchShopReviewTags } from '@/api/review';
import { REVIEW_TAG_EMOJI } from '@/constants/reviewTags';

const INITIAL_SHOW = 5;

interface TagItem {
  label: string;
  displayCount: number;
}

interface Props {
  shopId: string;
  onPressMore?: () => void;
}

const ShopTagList = ({ shopId, onPressMore }: Props) => {
  const [tags, setTags] = useState<TagItem[]>([]);

  useEffect(() => {
    fetchShopReviewTags(shopId).then((res) => setTags(res.items));
  }, [shopId]);

  if (tags.length === 0) return null;

  const visible = tags.slice(0, INITIAL_SHOW);

  return (
    <View style={styles.container}>
      {visible.map((tag, index) => (
        <View
          key={tag.label}
          style={[styles.tagRow, index === 0 && styles.tagRowTop]}
        >
          <Text style={styles.emoji}>
            {REVIEW_TAG_EMOJI[tag.label] ?? '🏷️'}
          </Text>
          <Text style={[styles.label, index === 0 && styles.labelTop]}>
            "{tag.label}"
          </Text>
          <Text style={[styles.count, index === 0 && styles.countTop]}>
            {tag.displayCount}
          </Text>
        </View>
      ))}
      {onPressMore && (
        <TouchableOpacity onPress={onPressMore} style={styles.moreRow}>
          <Text style={styles.moreText}>리뷰 탭에서 전체 보기 →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
  },
  tagRowTop: {
    backgroundColor: '#FFE0B2',
  },
  emoji: { fontSize: 22, marginRight: 12 },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: '#CC6600' },
  labelTop: { color: '#BF4F00' },
  count: { fontSize: 16, fontWeight: 'bold', color: '#FF8C00' },
  countTop: { color: '#E65C00' },
  moreRow: { alignItems: 'flex-end', marginTop: 2 },
  moreText: { fontSize: 12, color: '#FF8C00' },
});

export default ShopTagList;
