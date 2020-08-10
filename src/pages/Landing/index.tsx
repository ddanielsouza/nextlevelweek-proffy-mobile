import React, { useEffect, useState } from 'react'
import { View, Image, Text, TouchableOpacity} from 'react-native'
import styles from './styles';
import { RectButton } from 'react-native-gesture-handler'
import landingImg from '../../assets/images/landing.png';
import studyIcon from '../../assets/images/icons/study.png';
import giveClassIcon from '../../assets/images/icons/give-classes.png';
import heartIcon from '../../assets/images/icons/heart.png';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';


function Landing(){
    const [connections, setConnections] = useState(0);
    const navigation = useNavigation();

    function handleNavigateToGiveClassesPage(){
        navigation.navigate('GiveClasses');
    }

    function handleNavigateToStudyPages(){
        navigation.navigate('StudyTabs');
    }

    useEffect(() => {
        async function loadConnections() {
          try {
            const response = await api.get('/connections');
            const { data } = response;
            setConnections(data.total);
          } catch (err) {
            console.log(err?.response?.data?.error ? err.response.data.error : err.message);
          } 
        }
    
        loadConnections();
    }, []);

    return (
        <View style={styles.container}>
            <Image source={ landingImg }  style={styles.banner}/>
            <Text style={styles.title}> 
                Seja bem-vindo, {'\n'}
                <Text  style={styles.titleBold} >o que deseja fazer</Text>
            </Text>

            <View style={styles.buttonsContainer}>
                <RectButton onPress={ handleNavigateToStudyPages } style={[styles.button, styles.buttonPrimary]}>
                    <Image source={ studyIcon }  style={styles.banner}/>
                    <Text  style={styles.buttonText} > Estudar </Text>
                </RectButton>

                <RectButton onPress={handleNavigateToGiveClassesPage} style={[styles.button, styles.buttonSecondary]}>
                    <Image source={ giveClassIcon }  style={styles.banner}/>
                    <Text  style={styles.buttonText} > Dar Aulas </Text>
                </RectButton>
            </View>

            <Text  style={styles.totalConnections} > 
                Total de {connections} conexões já realizadas {'  '}
                <Image source={ heartIcon } />
            </Text>
        </View>
    )
}

export default Landing;