import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView, type WebViewNavigation } from 'react-native-webview';

const WEB_APP_URL = process.env.EXPO_PUBLIC_APP_URL ?? 'https://abelcjh.github.io/reliefkaki/';

function ReliefKakiMobile() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webViewRef.current?.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  function handleNavigationChange(state: WebViewNavigation) {
    setCanGoBack(state.canGoBack);
  }

  function retry() {
    setLoadError(false);
    setReloadKey((current) => current + 1);
  }

  if (loadError) {
    return (
      <View style={styles.errorScreen}>
        <View style={styles.mark}><Text style={styles.markText}>R</Text></View>
        <Text style={styles.errorTitle}>ReliefKaki could not connect</Text>
        <Text style={styles.errorCopy}>Check your internet connection, then try again.</Text>
        <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={retry}>
          <Text style={styles.primaryButtonText}>Try again</Text>
        </Pressable>
        <Pressable accessibilityRole="link" style={styles.linkButton} onPress={() => Linking.openURL(WEB_APP_URL)}>
          <Text style={styles.linkButtonText}>Open the web version</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WebView
      key={reloadKey}
      ref={webViewRef}
      source={{ uri: WEB_APP_URL }}
      style={styles.webView}
      originWhitelist={['https://*']}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loadingScreen}>
          <View style={styles.mark}><Text style={styles.markText}>R</Text></View>
          <ActivityIndicator color="#20463a" size="small" />
          <Text style={styles.loadingText}>Opening ReliefKaki…</Text>
        </View>
      )}
      onNavigationStateChange={handleNavigationChange}
      onError={() => setLoadError(true)}
      allowsBackForwardNavigationGestures
      pullToRefreshEnabled
      setSupportMultipleWindows={false}
      applicationNameForUserAgent="ReliefKakiMobile/1.0"
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <ReliefKakiMobile />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
  webView: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
  loadingScreen: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: '#f5f0e8',
  },
  loadingText: {
    color: '#375249',
    fontSize: 14,
    fontWeight: '600',
  },
  mark: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#20463a',
  },
  markText: {
    color: '#fffdf8',
    fontSize: 27,
    fontWeight: '800',
  },
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#f5f0e8',
  },
  errorTitle: {
    marginTop: 22,
    color: '#18352c',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorCopy: {
    maxWidth: 320,
    marginTop: 10,
    color: '#5d6d67',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  primaryButton: {
    minWidth: 180,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#20463a',
  },
  primaryButtonText: {
    color: '#fffdf8',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  linkButtonText: {
    color: '#20463a',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
