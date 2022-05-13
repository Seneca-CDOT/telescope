import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  paginationButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#9CA3AF85',
    borderRadius: 8,
    borderWidth: 1,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    margin: 12,
    padding: 12,
  },
  paginationButtonDisable: {
    backgroundColor: '#FFFFFF50',
    borderColor: '#9CA3AF50',
    color: '#00000050',
  },
  paginationButtonLeft: {
    justifyContent: 'flex-start',
  },
  paginationButtonRight: {
    justifyContent: 'flex-end',
  },
});

const PaginationButton = ({
  iconLeft = null,
  iconRight = null,
  title,
  disabled = false,
  onPressAction,
  align = 'left',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled}
      style={[
        styles.paginationButton,
        align === 'right' ? styles.paginationButtonRight : styles.paginationButtonLeft,
        disabled ? styles.paginationButtonDisable : null,
      ]}
      onPress={onPressAction}
    >
      <>
        {iconLeft || null}
        <Text style={disabled ? styles.paginationButtonDisable : null}>{title}</Text>
        {iconRight || null}
      </>
    </TouchableOpacity>
  );
};

export default PaginationButton;
