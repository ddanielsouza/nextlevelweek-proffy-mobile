import React, { useState } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import PageHeader from '../../components/PageHeader';

import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { useFocusEffect } from '@react-navigation/native';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  async function loadFavorites() {
    return new Promise(resolve =>{
      AsyncStorage.getItem('favorites').then((response) => {
        if (response) {
          const favoritedTeachers = JSON.parse(response);
          setFavorites(favoritedTeachers);
        }
        resolve();
      });
    })
  }

  useFocusEffect(() => {
    loadFavorites();
  });
  
  return (
    <View style={styles.container}>
      <PageHeader title="Meus proffys favoritos" />
      <ScrollView 
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16, 
        }}
        style={styles.teacherList}
      >
        {favorites.map((teacher: Teacher, index) => ( <TeacherItem key={index} teacher={teacher} favorited /> ))}
      </ScrollView>
    </View>
  );
}

export default Favorites;