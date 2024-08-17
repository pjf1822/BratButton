import LottieView from 'lottie-react-native';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { useGroupStore } from '@/zustandStore';
import { voteYes } from '@/api';

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
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/bitch-101soundboards2.mp3')
    );
    setSound(sound);
    await sound.playAsync();
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
          source={require('../assets/button.json')}
        />
      </TouchableOpacity>
  )
}

export default BitchButton

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'purple',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      fontFamily: 'Kalthin',
      color: 'red',
      fontSize: 30,
      fontWeight: '100',
    },
    mainText: {
      fontFamily: 'Kalthin',
      color: 'red',
      fontSize: 100,
      fontWeight: '100',
    },
    subtitle: {
      fontFamily: 'Kalthin',
      color: 'red',
      fontSize: 30,
      fontWeight: '100',
    },
    button: {
      width: 200,
      height: 200,
    },
    lottieView: {
      width: 200,
      height: 200,
    },
  });
  