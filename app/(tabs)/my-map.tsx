// app/(tabs)/my-map.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from "react-native";
import NaverMapViewComponent from "../../components/features/map/NaverMapView";

export default function MyMapScreen() {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // API 서버에서 소금빵집 위치 정보 가져오기
    fetch("http://10.0.2.2:4000/shops/locations")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setShops(json.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator /></View>
      ) : (
        <NaverMapViewComponent shops={shops} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" }
});

// // app/(tabs)/my-map.tsx
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { NaverMapView, NaverMapMarker } from '@mj-studio/react-native-naver-map';

// export default function MyMapScreen() {
//   return (
//     <View style={styles.container}>
//       <NaverMapView
//         style={styles.map}
//         initialCamera={{
//           latitude: 37.5665,
//           longitude: 126.978,
//           zoom: 15,
//         }}
//         isShowLocationButton={true} // 내 위치 버튼
//       >
//         {/* 나중에 데이터 연결 시 여기에 마커(핀) 추가 */}
//         {/* <NaverMapMarker
//           coordinate={{ latitude: 37.5665, longitude: 126.978 }}
//           onClick={() => console.log('핀 클릭!')}
//           caption={{ text: "서울시청" }}
//         /> 
//         */}
//       </NaverMapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });