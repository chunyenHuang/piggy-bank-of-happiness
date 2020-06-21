import * as React from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { Text } from 'react-native-elements';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text h4 style={styles.paragraph}>
          目標對象：全台灣的非營利事業組織兒少陪伴單位
        </Text>
        <Text style={styles.paragraph}>
          建置一套電子資訊系統，讓孩子們可透過執行任務獲得相對應的點數，累積的點數可向學校換取獎品或是客製化的需求（例如：修鞋，修車），讓孩子實際感受獲得自身付出所得到的酬勞
        </Text>
        <Text style={styles.paragraph}>
          台灣每年約有4萬3千名高風險家庭的兒少、2萬3千名中離學生及4千名中輟生，因為家庭功能不足，獨自面對學習落後、生存挑戰，甚至提早離開學習現場，繼續陷入惡性循環。
        </Text>
        <Button
          onPress={ ()=> Linking.openURL('https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ')}
        >
          跳坑首頁
        </Button>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  contentContainer: {
    // padding: 8,
    // paddingTop: 30,
  },
  paragraph: {
    paddingBottom: 16,
  },
});
