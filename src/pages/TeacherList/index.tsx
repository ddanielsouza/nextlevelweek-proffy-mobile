import React, { useState } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import PageHeader from '../../components/PageHeader';

import styles from './styles';
import TeacherItem from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import IsVisible from '../../components/IsVisible';
import {Feather} from '@expo/vector-icons'
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import {Teacher} from '../../components/TeacherItem';


function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [selectedValue, setSelectedValue] = useState('test');
  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  async function loadFavorites() {
    return new Promise(resolve =>{
      AsyncStorage.getItem('favorites').then((response) => {
        if (response) {
          const favoritedTeachers = JSON.parse(response);
          const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
            return teacher.id;
          });
  
          setFavorites(favoritedTeachersIds);
        }

        resolve();
      });
    })
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  async function handleFilterSubmit(){
    try {
      await loadFavorites();

      if(subject && week_day && time){
        const response = await api.get('/classes', { params: {
            subject,
            week_day,
            time,
          } 
        });

        const { data } = response;
        setTeachers(data || []);

        setIsFiltersVisible(false);
      }
    } catch (err) {
      console.log(err?.response?.data?.message ? err.response.data.message : err.message);
    }
  }


  return (
    <View style={styles.container}>
      
      <PageHeader 
        title="Proffys disponíveis" 
        headerRigth={(
          <BorderlessButton 
            style={{padding: 10, right: -10}}
            onPress={()=>setIsFiltersVisible(!isFiltersVisible)}
          >
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
        )}
      >
        <IsVisible isVisible={isFiltersVisible}>
          <View style={styles.searchForm}>
            <Text style={styles.label}> Materia </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Matéria" 
              value={subject}
              onChangeText={(text) => setSubject(text)}
              placeholderTextColor="#c1bccc">
            </TextInput>
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}> Dia semana </Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Dia semana" 
                  value={week_day}
                  onChangeText={(text) => setWeekDay(text)}
                  placeholderTextColor="#c1bccc">
                </TextInput>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}> Horário </Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Horário" 
                  placeholderTextColor="#c1bccc"
                  value={time}
                  onChangeText={(text) => setTime(text)}
                >
                </TextInput>
              </View>
            </View>
        
            <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
                <Text style={styles.submitButtonText}> Filtrar </Text>
            </RectButton>
          </View>
        </IsVisible>
      </PageHeader>
      <ScrollView 
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16, 
        }}
        style={styles.teacherList}
      >
        { 
          teachers.map(
            (teacher: Teacher, index) => (
              <TeacherItem 
                key={index} 
                favorited={favorites.includes(teacher.id)} 
                teacher={teacher}
              />
            )
          )
        }
        
      </ScrollView>
      
    </View>
  );
}

export default TeacherList;