import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimePickerComponent = ({
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
}) => {
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const handleConfirm = (chosenDateTime, setter) => {
    setter(chosenDateTime);
    setStartPickerVisibility(false);
    setEndPickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <DateTimeRow
        label="Start Date/Time:"
        dateTime={startDateTime}
        showPicker={() => setStartPickerVisibility(true)}
        onConfirm={(dateTime) => handleConfirm(dateTime, setStartDateTime)}
        isPickerVisible={isStartPickerVisible}
        hidePicker={() => setStartPickerVisibility(false)}
      />
      <DateTimeRow
        label="End Date/Time:"
        dateTime={endDateTime}
        showPicker={() => setEndPickerVisibility(true)}
        onConfirm={(dateTime) => handleConfirm(dateTime, setEndDateTime)}
        isPickerVisible={isEndPickerVisible}
        hidePicker={() => setEndPickerVisibility(false)}
      />
    </View>
  );
};

const DateTimeRow = ({
  label,
  dateTime,
  showPicker,
  onConfirm,
  isPickerVisible,
  hidePicker,
}) => {
  const formattedDate = `${dateTime.getDate()}/${
    dateTime.getMonth() + 1
  }/${dateTime.getFullYear()}`;

  let hours = dateTime.getHours();
  let minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Button title={formattedDate} onPress={showPicker} color="#808080" />
      <Button title={formattedTime} onPress={showPicker} color="#808080" />
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        date={dateTime}
        onConfirm={onConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default DateTimePickerComponent;
