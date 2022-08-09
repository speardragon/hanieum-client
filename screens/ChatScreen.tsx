import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import Voice from "@react-native-community/voice";
import { useRecordingCheck } from "../utils/hooks";
import { Button } from "@rneui/themed";
import { Avatar, Input } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
// import {db, auth} from 'firebase'
import uuid from "react-native-uuid";
import axios from "axios";

const uer = "asdf";
const USER = {
  _id: 1,
  name: "Me",
};
const BOT = {
  _id: 2,
  name: "Bot",
  avatar: "",
};

const URL =
  "http://210.178.239.160:3000/bus/reservation/auto/ai?latitude=37.6199365&longitude=127.0610036";

const ChatScreen = ({ navigation }) => {
  // const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "예매 AI",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerTitleAlign: "center",
    });
  }, []);

  const [text, setText] = useState<string>("");
  const [speechStarted, setSpeechStarted] = useState<boolean>(false);

  const onSpeechStart = () => {
    setSpeechStarted(true);
  };

  const onSpeechEnd = () => {
    setSpeechStarted(false);
  };

  const onSpeechResults = async (e: { value: string[] }) => {
    if (e && e.value && e.value[0]) {
      setText(e.value[0]);
    }
  };

  const stopRecording = () => {
    if (!text) {
      Voice.cancel();
    } else {
      Voice.stop();
    }
    setSpeechStarted(false);
  };

  // useRecordingCheck(text, stopRecording, speechStarted);

  // const sendMessage = (data) => {
  //   Keyboard.dismiss();

  //   const result = requestToAI();
  //   setInput("");
  // };

  useEffect(() => {
    setMessages([
      {
        _id: uuid.v4(),
        text: "안녕하세요 시외버스 예매 챗봇 AI 부릉이 입니다.",
        createdAt: new Date(),
        user: BOT,
      },
    ]);
  }, []);

  const requestToAI = async (message: string) => {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "terSto": "대전",
          "terSfr": "",
          "date": "20220808",
          "time": "1200",
        }),
      });

      const json = await response.json();
      console.log(json.message);
      const responseMessages = {
        _id: uuid.v4(),
        text: json.message,
        createdAt: new Date(),
        user: BOT,
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, responseMessages)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onSend = useCallback((messages = []) => {
    console.log(messages[0].text);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    requestToAI(messages[0].text);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={USER}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-end",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    justifyContent: "space-evenly",
  },
  textInput: {
    bottom: 0,
    height: 40,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});

// import React, { useState, useEffect } from "react";
// import Styled from "styled-components/native";
// import Voice from "react-native-voice";

// const Container = Styled.View`
//   flex: 1;
//   justify-content: center;
//   align-items: center;
//   background-color: #f5fcff;
// `;
// const ButtonRecord = Styled.Button``;
// const VoiceText = Styled.Text`
//   margin: 32px;
// `;
// // prettier-disabled
// const ChatScreen = () => {
//   const [isRecord, setIsRecord] = useState(false);
//   const [text, setText] = useState("");
//   const buttonLabel = isRecord ? "Stop" : "Start";
//   const voiceLabel = text
//     ? text
//     : isRecord
//     ? "Say something..."
//     : "press Start button";

//   const _onSpeechStart = () => {
//     console.log("onSpeechStart");
//     setText("");
//   };
//   const _onSpeechEnd = () => {
//     console.log("onSpeechEnd");
//   };
//   const _onSpeechResults = (event) => {
//     console.log("onSpeechResults");
//     setText(event.value[0]);
//   };
//   const _onSpeechError = (event) => {
//     console.log("_onSpeechError");
//     console.log(event.error);
//   };

//   const _onRecordVoice = () => {
//     if (isRecord) {
//       Voice.stop();
//     } else {
//       Voice.start("en-US");
//     }
//     setIsRecord(!isRecord);
//   };

//   useEffect(() => {
//     Voice.onSpeechStart = _onSpeechStart;
//     Voice.onSpeechEnd = _onSpeechEnd;
//     Voice.onSpeechResults = _onSpeechResults;
//     Voice.onSpeechError = _onSpeechError;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);
//   return (
//     <Container>
//       <VoiceText>{voiceLabel}</VoiceText>
//       <ButtonRecord onPress={_onRecordVoice} title={buttonLabel} />
//     </Container>
//   );
// };

// export default ChatScreen;

// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableHighlight,
// } from "react-native";

// import Voice, {
//   SpeechRecognizedEvent,
//   SpeechResultsEvent,
//   SpeechErrorEvent,
// } from "@react-native-voice/voice";

// function ChatScreen() {
//   const [recognized, setRecognized] = useState("");
//   const [volume, setVolume] = useState("");
//   const [error, setError] = useState("");
//   const [end, setEnd] = useState("");
//   const [started, setStarted] = useState("");
//   const [results, setResults] = useState([]);
//   const [partialResults, setPartialResults] = useState([]);

//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechRecognized = onSpeechRecognized;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechError = onSpeechError;
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechPartialResults = onSpeechPartialResults;
//     Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStart = (e: any) => {
//     console.log("onSpeechStart: ", e);
//     setStarted("√");
//   };

//   const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
//     console.log("onSpeechRecognized: ", e);
//     setRecognized("√");
//   };

//   const onSpeechEnd = (e: any) => {
//     console.log("onSpeechEnd: ", e);
//     setEnd("√");
//   };

//   const onSpeechError = (e: SpeechErrorEvent) => {
//     console.log("onSpeechError: ", e);
//     setError(JSON.stringify(e.error));
//   };

//   const onSpeechResults = (e: SpeechResultsEvent) => {
//     console.log("onSpeechResults: ", e);
//     setResults(e.value);
//   };

//   const onSpeechPartialResults = (e: SpeechResultsEvent) => {
//     console.log("onSpeechPartialResults: ", e);
//     setPartialResults(e.value);
//   };

//   const onSpeechVolumeChanged = (e: any) => {
//     console.log("onSpeechVolumeChanged: ", e);
//     setVolume(e.value);
//   };

//   const _startRecognizing = async () => {
//     _clearState();
//     try {
//       await Voice.start("ko-KR");
//       console.log("called start");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const _stopRecognizing = async () => {
//     try {
//       await Voice.stop();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const _cancelRecognizing = async () => {
//     try {
//       await Voice.cancel();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const _destroyRecognizer = async () => {
//     try {
//       await Voice.destroy();
//     } catch (e) {
//       console.error(e);
//     }
//     _clearState();
//   };

//   const _clearState = () => {
//     setRecognized("");
//     setVolume("");
//     setError("");
//     setEnd("");
//     setStarted("");
//     setResults([]);
//     setPartialResults([]);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
//       <Text style={styles.instructions}>
//         Press the button and start speaking.
//       </Text>
//       <Text style={styles.stat}>{`Started: ${started}`}</Text>
//       <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
//       <Text style={styles.stat}>{`Volume: ${volume}`}</Text>
//       <Text style={styles.stat}>{`Error: ${error}`}</Text>
//       <Text style={styles.stat}>Results</Text>
//       {results.map((result, index) => {
//         return (
//           <Text key={`result-${index}`} style={styles.stat}>
//             {result}
//           </Text>
//         );
//       })}
//       <Text style={styles.stat}>Partial Results</Text>
//       {partialResults.map((result, index) => {
//         return (
//           <Text key={`partial-result-${index}`} style={styles.stat}>
//             {result}
//           </Text>
//         );
//       })}
//       <Text style={styles.stat}>{`End: ${end}`}</Text>
//       <TouchableHighlight onPress={_startRecognizing}>
//         <Image style={styles.button} source={require("./button.png")} />
//       </TouchableHighlight>
//       <TouchableHighlight onPress={_stopRecognizing}>
//         <Text style={styles.action}>Stop Recognizing</Text>
//       </TouchableHighlight>
//       <TouchableHighlight onPress={_cancelRecognizing}>
//         <Text style={styles.action}>Cancel</Text>
//       </TouchableHighlight>
//       <TouchableHighlight onPress={_destroyRecognizer}>
//         <Text style={styles.action}>Destroy</Text>
//       </TouchableHighlight>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     width: 50,
//     height: 50,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5FCFF",
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10,
//   },
//   action: {
//     textAlign: "center",
//     color: "#0000FF",
//     marginVertical: 5,
//     fontWeight: "bold",
//   },
//   instructions: {
//     textAlign: "center",
//     color: "#333333",
//     marginBottom: 5,
//   },
//   stat: {
//     textAlign: "center",
//     color: "#B0171F",
//     marginBottom: 1,
//   },
// });

// export default ChatScreen;
