// app/my-page/review/index.tsx
import { useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReviewStore } from '@/store/useReviewStore';
import { REVIEW_TAG_EMOJI } from '@/constants/reviewTags';
import { MyReview } from '@/api/users';

export default function ReviewDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reviews, selectedIndex, clear } = useReviewStore();
  const listRef = useRef<FlatList<MyReview>>(null);

  useEffect(() => {
    if (reviews.length === 0 || selectedIndex === 0) return;
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: selectedIndex, animated: false });
    }, 100);
  }, []);

  const renderItem = ({ item }: { item: MyReview }) => (
    <View style={styles.card}>
      {/* 가게 정보 */}
      <View style={styles.shopRow}>
        {item.shop.heroImageUrl
          ? <Image source={{ uri: item.shop.heroImageUrl }} style={styles.shopThumb} />
          : <View style={[styles.shopThumb, styles.shopThumbFallback]} />
        }
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.shop.name}</Text>
          <Text style={styles.shopAddress} numberOfLines={1}>{item.shop.roadAddress}</Text>
        </View>
      </View>

      {/* 별점 */}
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons key={i} name={i < item.rating ? 'star' : 'star-outline'} size={16} color="#FF8C00" />
        ))}
        <Text style={styles.ratingText}>{item.rating}.0</Text>
      </View>

      {/* 리뷰 내용 */}
      <Text style={styles.content}>{item.content}</Text>

      {/* 태그 */}
      {item.tags.length > 0 && (
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{REVIEW_TAG_EMOJI[tag] ?? '🏷️'} {tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 리뷰 이미지 */}
      {item.images.length > 0 && (
        <View style={styles.imageRow}>
          {item.images.map((img) => (
            <Image key={img.id} source={{ uri: img.url }} style={styles.reviewImage} />
          ))}
        </View>
      )}

      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { clear(); router.back(); }}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내가 쓴 리뷰</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        ref={listRef}
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScrollToIndexFailed={() => {}}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  headerTitle: { fontSize: 17, fontWeight: 'bold' },

  card: { paddingHorizontal: 20, paddingVertical: 16 },
  shopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  shopThumb: { width: 44, height: 44, borderRadius: 8 },
  shopThumbFallback: { backgroundColor: '#f0f0f0' },
  shopInfo: { flex: 1 },
  shopName: { fontSize: 15, fontWeight: '700' },
  shopAddress: { fontSize: 12, color: '#888', marginTop: 2 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  ratingText: { fontSize: 13, color: '#FF8C00', fontWeight: '600', marginLeft: 4 },

  content: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 10 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: { backgroundColor: '#FFF4E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, color: '#FF8C00' },

  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  reviewImage: { width: 90, height: 90, borderRadius: 8 },

  date: { fontSize: 12, color: '#bbb' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
});
