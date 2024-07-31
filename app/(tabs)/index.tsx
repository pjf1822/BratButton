import { StyleSheet , Button, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View} from '@/components/Themed';
import LottieView from 'lottie-react-native';
import { useRef, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function TabOneScreen() {
  const animation = useRef<LottieView>(null);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('../../assets/bitch-101soundboards2.mp3')
    );
    setSound(sound);

    await sound.playAsync();
  }

  const deleteUserId = async () => {
    await AsyncStorage.removeItem("userId");
  }
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.animationContainer}>
      <Text style={{fontFamily:"Kal", color:"red",fontSize:30,fontWeight:100}}>IS SHE BEING A </Text>
      <Text style={{fontFamily:"Kal", color:"red",fontSize:100,fontWeight:100}}>BITCH</Text>
      <Text style={{fontFamily:"Kal", color:"red",fontSize:30,fontWeight:100}}>TODAY</Text>
      <TouchableOpacity 
          onPress={() => {
          deleteUserId()
            }}
 
>
  <Text>delete user id</Text>
</TouchableOpacity>

     <TouchableOpacity 
  onPress={() => {
    animation.current?.reset();
    animation.current?.play();
    playSound()
  }}
  style={{ width: 400, height: 400 }} 
>

      <LottieView
  progress={1}
  loop={false}
        ref={animation}
        style={{
          width: 400,
          height: 400,
        }}
        source={require('../../assets/button.json')}
      /> 
      </TouchableOpacity>
     
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
