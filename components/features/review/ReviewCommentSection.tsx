// components/features/review/ReviewCommentSection.tsx
// 리뷰 카드 하단: 좋아요 수 + 댓글 상위 3개 + 펼치기/접기
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReviewComment } from '@/types/review';
import { AppColors } from '@/constants/theme';

interface Props {
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  comments: ReviewComment[];
  onLikePress?: () => void;
  // collapsible: 내가 쓴 리뷰 탭처럼 기본 닫힌 상태
  // preview: 가게 리뷰 탭처럼 상위 3개 보이는 상태
  mode?: 'collapsible' | 'preview';
}

const PREVIEW_COUNT = 3;

export default function ReviewCommentSection({
  likeCount,
  commentCount,
  isLikedByMe,
  comments,
  onLikePress,
  mode = 'preview',
}: Props) {
  const [expanded, setExpanded] = useState(mode === 'preview');

  const visible = expanded ? comments : comments.slice(0, PREVIEW_COUNT);
  const hasMore = commentCount > PREVIEW_COUNT;

  return (
    <View style={styles.container}>
      {/* 좋아요 / 댓글 수 */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.stat} onPress={onLikePress} disabled={!onLikePress}>
          <Ionicons
            name={isLikedByMe ? 'heart' : 'heart-outline'}
            size={14}
            color={isLikedByMe ? '#FF4D4D' : '#888'}
          />
          <Text style={[styles.statText, isLikedByMe && styles.likedText]}>{likeCount}</Text>
        </TouchableOpacity>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={14} color="#888" />
          <Text style={styles.statText}>{commentCount}</Text>
        </View>
      </View>

      {/* 댓글 목록 */}
      {visible.map((comment) => (
        <View key={comment.id} style={styles.commentRow}>
          {comment.author.profileImageUrl ? (
            <Image source={{ uri: comment.author.profileImageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>
                {(comment.author.nickname ?? comment.author.displayName ?? '?').charAt(0)}
              </Text>
            </View>
          )}
          <View style={styles.commentContent}>
            <Text style={styles.commentAuthor}>
              {comment.author.nickname ?? comment.author.displayName ?? '익명'}
            </Text>
            <Text style={styles.commentText}>{comment.content}</Text>
          </View>
        </View>
      ))}

      {/* 펼치기 / 접기 */}
      {hasMore && (
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setExpanded((v) => !v)}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={AppColors.primary}
          />
          <Text style={styles.toggleText}>
            {expanded ? '접기' : `댓글 ${commentCount - PREVIEW_COUNT}개 더보기`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#888' },
  likedText: { color: '#FF4D4D' },

  commentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  avatar: { width: 24, height: 24, borderRadius: 12 },
  avatarFallback: { backgroundColor: AppColors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 10, color: AppColors.primary, fontWeight: 'bold' },
  commentContent: { flex: 1 },
  commentAuthor: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 1 },
  commentText: { fontSize: 13, color: '#555', lineHeight: 18 },

  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  toggleText: { fontSize: 13, color: AppColors.primary },
});
