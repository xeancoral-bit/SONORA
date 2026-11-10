import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

export default function App() {
  // Determine default server address:
  // Expo Constants provides hostUri (e.g., '192.168.1.18:8081') when launched via Metro / QR code
  const hostIp = Constants.expoConfig?.hostUri?.split(':')[0] || '192.168.1.18';
  const initialUrl = `http://${hostIp}:3000`;

  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const webViewRef = useRef<WebView>(null);

  // Android hardware back button handler: navigate within WebView history
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  const handleApplyUrl = () => {
    let clean = inputUrl.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `http://${clean}`;
    }
    setCurrentUrl(clean);
    setIsSettingsOpen(false);
    setHasError(false);
    setIsLoading(true);
  };

  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />

      {/* ── TOP MINIMAL STATUS & QUICK CONTROLS BAR ── */}
      {isHeaderVisible ? (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerTitleContainer}
            onPress={() => setIsSettingsOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.pulseDot} />
            <Text style={styles.headerBrand}>SONORA</Text>
            <Text style={styles.headerUrl} numberOfLines={1}>
              {currentUrl.replace(/^https?:\/\//, '')}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleReload}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>↻</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsSettingsOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>⚙</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnMini}
              onPress={() => setIsHeaderVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionTextMini}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.floatingShowHeaderBtn}
          onPress={() => setIsHeaderVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingShowText}>🎵 SONORA</Text>
        </TouchableOpacity>
      )}

      {/* ── MAIN HYBRID WEBVIEW (LIVE MUSIC SYSTEM) ── */}
      <View style={styles.webviewWrapper}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webview}
          onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            if (nativeEvent.statusCode >= 500) {
              setHasError(true);
            }
          }}
          // Media & Audio Playback settings
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          cacheEnabled={true}
          mixedContentMode="always"
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Streaming SONORA...</Text>
            </View>
          )}
        />

        {/* ── CONNECTION ERROR / OFFLINE SCREEN ── */}
        {hasError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorEmoji}>📡</Text>
            <Text style={styles.errorTitle}>Cannot Connect to Server</Text>
            <Text style={styles.errorDesc}>
              Unable to reach {currentUrl}.{'\n\n'}
              1. Make sure your computer is running `npm run dev` or the server is deployed.{'\n'}
              2. Make sure your phone and laptop are on the same Wi-Fi network.{'\n'}
              3. Check the server IP address or use a tunnel URL.
            </Text>

            <View style={styles.errorButtons}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleReload}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrimaryText}>Retry Connection</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setIsSettingsOpen(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnSecondaryText}>Change Server URL</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ── SETTINGS & SERVER URL SWITCHER MODAL ── */}
      <Modal
        visible={isSettingsOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SONORA Server Configuration</Text>
            <Text style={styles.modalSubtitle}>
              Connect your phone to your local dev computer or deployed Vercel URL.
            </Text>

            <Text style={styles.inputLabel}>Server URL:</Text>
            <TextInput
              style={styles.input}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://192.168.1.x:3000 or https://..."
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <View style={styles.presetButtons}>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setInputUrl(`http://${hostIp}:3000`)}
              >
                <Text style={styles.presetText}>Local WiFi ({hostIp}:3000)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setInputUrl('http://localhost:3000')}
              >
                <Text style={styles.presetText}>localhost:3000</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsSettingsOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleApplyUrl}
              >
                <Text style={styles.modalSaveText}>Connect & Load</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d0d11',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a24',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  headerBrand: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
    marginRight: 6,
  },
  headerUrl: {
    color: '#888899',
    fontSize: 11,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1e1e28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionBtnMini: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1e1e28',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  actionTextMini: {
    color: '#999999',
    fontSize: 10,
    fontWeight: 'bold',
  },
  floatingShowHeaderBtn: {
    position: 'absolute',
    top: 36,
    right: 12,
    zIndex: 999,
    backgroundColor: 'rgba(20, 20, 26, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  floatingShowText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0e',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#cccccc',
    fontSize: 13,
    marginTop: 12,
    fontWeight: '600',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 20,
  },
  errorEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDesc: {
    color: '#9999aa',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnSecondary: {
    backgroundColor: '#1f1f2e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#33334d',
  },
  btnSecondaryText: {
    color: '#ffffff',
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#14141c',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252538',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#888899',
    fontSize: 11,
    marginBottom: 16,
    lineHeight: 16,
  },
  inputLabel: {
    color: '#aaaaaa',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0a0a0e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  presetBtn: {
    backgroundColor: '#1a1a26',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  presetText: {
    color: '#38BDF8',
    fontSize: 11,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalCancelText: {
    color: '#888899',
    fontSize: 13,
  },
  modalSaveBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
