const express = require('express');

const app = express();
app.use(express.json());

// Verify Webhook setup
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'sometoken') {
        console.log(req.query['hub.challenge']);
        res.send(req.query['hub.challenge']);
    } else {
        req.query['hub.challenge'];
        res.send('Error, wrong token');
    }

    console.log(req.body)
});

// Verify Webhook setup
app.get('/', (req, res) => {
    res.send("Hello")
});

// Handle incoming POST data
app.post('/webhook', (req, res) => {
    const data = req.body;
    console.log(data)
    console.log(req.params)
    console.log(req.path)
    console.log(req.query)

    // Check if the update is about a comment
    if (data.object === 'page') {
        data.entry.forEach((entry) => {
            const pageID = entry.id;
            entry.changes.forEach((change) => {
                console.log("RAW => ", change)
                if (change.field === 'feed' && change.value.item === 'comment') {
                    console.log('New comment detected:', change.value);
                } else {
                    console.log("No new Comment")
                }
            });
        });
    }
    res.sendStatus(200);
});


app.get('/secret', (req, res) => {
    res.send(`import Colors from "@/constants/Colors";
import { selectSpecification } from "@/redux/selectors/specification";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useSelector } from "react-redux";

interface DateStyle {
  color: string;
  textColor: string;
}

const generateDateRange = (
  startDate: string,
  endDate: string
): Record<string, DateStyle> => {
  const dates: Record<string, DateStyle> = {};
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const formattedDate: string = currentDate.toISOString().split("T")[0];
    dates[formattedDate] = {
      color: "#d9d2f9",
      textColor: "white",
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const MyCalendar = () => {
  const [showDate, setShowDate] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const handleDayPress = (day: DateData) => {
    const selectedDate: string = day.dateString;

    if (!selectedStartDate) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate("");
    } else if (
      !selectedEndDate &&
      new Date(selectedDate) >= new Date(selectedStartDate)
    ) {
      setSelectedEndDate(selectedDate);
    } else {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate("");
    }
  };

  const markedDates = {
    ...generateDateRange(selectedStartDate, selectedEndDate),
    [selectedStartDate]: {
      selected: true,
      color: Colors.listSecondaryBackground,
      textColor: "white",
    },
    [selectedEndDate]: {
      selected: true,
      color: Colors.listSecondaryBackground,
      textColor: "white",
    },
  };
  const handleDate = () => {
    setShowDate(() => !showDate);
  };
  const specification = useSelector(selectSpecification);
  return (
    <View style={{}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.specificationsDetails}>
          <Pressable onPress={handleDate} style={{ flexDirection: "row" }}>
            {showDate ? (
              <Text style={styles.date}>
                {selectedStartDate || "yy/mm/dd"} -{" "}
                {selectedEndDate || "yy/mm/dd"}
              </Text>
            ) : (
              <Text style={styles.date}>Select Dates</Text>
            )}
          </Pressable>
          <Text style={styles.friend}>Crowd - Friends</Text>
          <Text style={styles.friend}>
            {specification?.trip_duration_value || "N"}{" "}
            {specification?.trip_duration_unit || "Days"}
          </Text>
        </View>
      </ScrollView>
      {showDate && (
        <View style={styles.container}>
          <View style={styles.centeredView}>
            <Modal animationType="none" transparent={true} visible={showDate}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      width: Dimensions.get("window").width,
                    }}
                  >
                    <Calendar
                      onDayPress={handleDayPress}
                      markedDates={markedDates}
                      markingType={"period"}
                    />
                  </View>
                  <View style={styles.doneBtn}>
                    <Pressable onPress={() => setShowDate(false)}>
                      <Text style={styles.doneBtnTxt}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={() => setShowDate(false)}>
                      <Text style={styles.doneBtnTxt}>Done</Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      width: 112,
                      height: 5,
                      backgroundColor: "#F0EDF3",
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doneBtn: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingHorizontal: 25,
    paddingVertical: 22,
    gap: 30,
  },
  doneBtnTxt: {
    fontWeight: "500",
    color: Colors.listSecondaryBackground,
  },
  specificationsDetails: {
    flexDirection: "row",
    gap: 5,
  },
  friend: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.listSecondaryBackground,
    borderRadius: 20,
    color: "#A89DDB",
    padding: 10,
    bottom: 1,
  },
  date: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.listSecondaryBackground,
    borderRadius: 20,
    color: "#A490F6",
    padding: 10,
    position: "relative",
    bottom: 1,
  },
  container: {
    width: Dimensions.get("window").width - 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginTop: 50,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height - 380,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default MyCalendar;
`)

})

// app.post('/webhook', (req, res) => {
//     console.log('Webhook event received:', req.body);
//     res.status(200).send('EVENT_RECEIVED');
// });

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

