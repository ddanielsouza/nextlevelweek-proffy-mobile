import React, { useState } from 'react';
import { View, Image, Text, Linking, AsyncStorage } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';
import api from '../../services/api';
export interface Teacher {
    id: number;
    user_id: number;
    name: string;
    email: string;
    whatsapp: string;
    avatar: string;
    avatar_url: string;
    bio: string;
    class_id: number;
    subject: string;
    cost: string;
  }
  
  interface TeacherItemProps {
    teacher: Teacher;
    favorited: boolean;
  }

const TeacherItem: React.FunctionComponent<TeacherItemProps> = ({teacher, favorited}) => {
    const [isFavorited, setIsFavorites] = useState(favorited);

    function handleLinkToWhatsapp(){
        api.post('connections', {
            user_id: teacher.user_id,
          });

        Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}&text=test`);
    }

    async function handleToggleFavorite() {
        let favorites: Array<Teacher> = JSON.parse(await AsyncStorage.getItem('favorites') || '[]');
    
        if (isFavorited) {
            const favoritesIndex = favorites.findIndex((teacherItem: Teacher) => {
                return teacherItem.id === teacher.id;
            });


            favorites.splice(favoritesIndex, 1);
            setIsFavorites(false);
        } else {
            favorites.push(teacher);
            setIsFavorites(true);
        }

        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      }

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image style={styles.avatar} source={{uri: teacher.avatar}}></Image>
            </View>

            <View style={styles.profileInfo}>
                <Text style={styles.name} >  { teacher.name }</Text>
                <Text style={styles.subject} >  { teacher.subject } </Text>
            </View>

            <Text style={styles.bio}>
                { teacher.bio }
            </Text>

            <View style={styles.footer}>
                <Text style={styles.price}>  
                    Preço/hora { '   ' } 
                    <Text style={styles.priceValue}> { teacher.cost } </Text>
                </Text>
            
                
            </View>

            <View style={styles.buttonsContainer}>
                <RectButton 
                    style={[styles.favoriteButton, isFavorited? styles.favorited : null]} 
                    onPress={handleToggleFavorite}
                >
                    <Image source={isFavorited ? unfavoriteIcon: heartOutlineIcon}/>
                </RectButton>

                <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
                    <Image source={whatsappIcon}/>
                    <Text style={styles.contactButtonText}> Entrar em contato </Text>
                </RectButton>
            </View>
        </View>
    );
};

export default TeacherItem;