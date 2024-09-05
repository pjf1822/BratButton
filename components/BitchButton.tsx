import LottieView from 'lottie-react-native';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { useGroupStore } from '@/zustandStore';

interface BitchButtonProps {
  userData: {
    id: string;  
    username: string;
  };
  selectedGroupId: string | undefined;  
}
const BitchButton: React.FC<BitchButtonProps> = ({ userData, selectedGroupId }) => {
      const [sound, setSound] = useState<Audio.Sound | null>(null);

      const animation = useRef<LottieView>(null);

      const addVoteYes = useGroupStore((state) => state.addVoteYes);


    
  async function playSound() { 
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/bratt.wav')
    );
    setSound(sound);
    await sound.playAsync();
  }


   useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);



    return (
        <TouchableOpacity
        onPress={() => {
          animation.current?.reset();
          animation.current?.play();
          playSound();
          if (selectedGroupId && userData) {
            addVoteYes(selectedGroupId, userData);
          }        }}
        style={styles.button}
      >
        <LottieView
          progress={1}
          loop={false}
          ref={animation}
          style={styles.lottieView}
          source={require('../assets/slatt.json')}
        />

      </TouchableOpacity>
  )
}

export default BitchButton

const styles = StyleSheet.create({
 
    button: {
     
    
      
    },
    lottieView: {
      width: 290,
      height: 290,
 
    },
  });
  