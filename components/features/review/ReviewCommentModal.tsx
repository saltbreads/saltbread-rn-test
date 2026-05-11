// components/features/review/ReviewCommentModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchComments, postComment } from '@/api/review';
import { ReviewComment } from '@/types/review';
import { AppColors } from '@/constants/theme';

interface Props {
  visible: boolean;
  reviewId: string;
  commentCount: number;
  accessToken: string | null;
  onClose: () => void;
  onCommentAdded: () => void; // 댓글 작성 후 부모 리뷰 카드 카운트 갱신용
}

export default function ReviewCommentModal({
  visible,
  reviewId,
  commentCount,
  accessToken,
  onClose,
  onCommentAdded,
}: Props) {
  const insets = useSafeAreaInsets();
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchComments(reviewId).then((data) => {
      setComments(data.items ?? []);
      setLoading(false);
    });
  }, [visible, reviewId]);

  const handleSubmit = async () => {
    if (!inputText.trim() || !accessToken || submitting) return;
    setSubmitting(true);
    const ok = await postComment(reviewId, inputText.trim(), accessToken);
    if (ok) {
      setInputText('');
      // 댓글 목록 새로고침
      const data = await fetchComments(reviewId);
      setComments(data.items ?? []);
      onCommentAdded();
    }
    setSubmitting(false);
  };

  const renderComment = ({ item }: { item: ReviewComment }) => (
    // TODO: 댓글 우측 ... 아이콘 추가 예정
    // - 본인 댓글: 삭제 (DELETE /reviews/comments/:commentId)
    // - 타인 댓글: 신고
    // → ActionSheet 또는 바텀 모달로 구현
    <View style={styles.commentRow}>
      {item.author.profileImageUrl ? (
        <Image source={{ uri: item.author.profileImageUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitial}>
            {(item.author.nickname ?? item.author.displayName ?? '?').charAt(0)}
          </Text>
        </View>
      )}
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>
          {item.author.nickname ?? item.author.displayName ?? '익명'}
        </Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentDate}>
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { marginBottom: keyboardHeight }]}>
        {/* 헤더 */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerTitle}>댓글 {commentCount}개</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* 댓글 목록 */}
        {loading ? (
          <ActivityIndicator style={{ flex: 1 }} color={AppColors.primary} />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderComment}
            style={{ flex: 1 }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</Text>
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {/* 입력창 */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={accessToken ? '댓글을 입력하세요...' : '로그인 후 댓글을 달 수 있어요'}
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            editable={!!accessToken}
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || !accessToken) && styles.sendBtnDisabled]}
            onPress={handleSubmit}
            disabled={!inputText.trim() || !accessToken || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },

  listContent: { padding: 20 },
  commentRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarFallback: { backgroundColor: AppColors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 13, color: AppColors.primary, fontWeight: 'bold' },
  commentContent: { flex: 1 },
  commentAuthor: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  commentText: { fontSize: 14, color: '#333', lineHeight: 20 },
  commentDate: { fontSize: 11, color: '#bbb', marginTop: 3 },
  separator: { height: 16 },

  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 14 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#ccc' },
});
