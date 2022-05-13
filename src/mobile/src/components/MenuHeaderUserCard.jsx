import { Avatar } from 'react-native-elements';
import { Text, StyleSheet, View, Pressable } from 'react-native';

const styles = StyleSheet.create({
  avatarPosition: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 24,
  },
  buttonGroup: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  connectButton: {
    alignItems: 'center',
    backgroundColor: '#121D59',
    borderRadius: 5,
    elevation: 5,
    paddingHorizontal: 32,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  // Disabled button
  disabled: {
    opacity: 0.5,
  },
  headerCard: {
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 2,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  headerCardShadowBottom: {
    overflow: 'hidden',
    paddingBottom: 10,
  },
  userName: {
    fontWeight: '700',
    marginLeft: 12,
  },
});

/* eslint-disable react-native/no-inline-styles */
const MenuHeaderUserCard = () => {
  return (
    <View style={styles.headerCardShadowBottom}>
      <View style={styles.headerCard}>
        <View style={styles.avatarPosition}>
          <Avatar
            size="medium"
            icon={{ name: 'user', type: 'font-awesome' }}
            overlayContainerStyle={{ backgroundColor: '#9CA3AF85' }}
            rounded
          />
          <Text style={styles.userName}>Anonymous User</Text>
        </View>
        <View style={styles.buttonGroup}>
          {/* Disabled button */}
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.75 : 1 },
              styles.connectButton,
              styles.disabled,
            ]}
            disabled
          >
            <Text style={styles.buttonText}>Connect</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default MenuHeaderUserCard;
