import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, Text, ImageBackground, Platform, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import styles from './styles';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface ItemPicker {
    label: string;
    value: string;
}

const Home = () => {
    const navigation = useNavigation();
    const [ufs, setUfs] = useState<ItemPicker[]>([]);
    const [cities, setCities] = useState<ItemPicker[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const placeholderUf = {
        label: 'Selecione um Estado',
        value: null,
        color: '#505050',
    };

    const placeholderCity = {
        label: 'Selecione uma Cidade',
        value: null,
        color: '#505050',
    };

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

            const ufInitials = response.data.map(uf => ({ label: uf.sigla, value: uf.sigla }));
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        console.log('chamou')
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            console.log(response);
            const cityNames = response.data.map(city => ({ label: city.nome, value: city.nome }));

            setCities(cityNames);

        });

    }, [selectedUf]);

    function handleNavigateToPoint() {
        navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
    }

    function handleSelectUf(data: string) {
        console.log(data);
        const uf = data;
        setSelectedUf(uf);
    }

    function handleSelectCity(data: string) {
        const city = data;
        setSelectedCity(city);
    }




    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/home-background.png')}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <RNPickerSelect
                    placeholder={placeholderUf}
                    style={pickerSelectStyles}
                    onValueChange={(value) => handleSelectUf(value)}
                    items={ufs}
                    Icon={() => {
                        return (
                            <View
                                style={styles.icon}
                            />
                        );
                    }}
                />
                <RNPickerSelect
                    placeholder={placeholderCity}
                    style={pickerSelectStyles}
                    onValueChange={(value) => handleSelectCity(value)}
                    items={cities}
                    Icon={() => {
                        return (
                            <View
                                style={styles.icon}
                            />
                        );
                    }}
                />
                <RectButton style={styles.button} onPress={handleNavigateToPoint}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" size={24} color="#FFF" />
                    </View>
                    <Text style={styles.buttonText}>
                        ENTRAR
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        backgroundColor: "#fff",
        fontSize: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderColor: 'gray',
        borderRadius: 10,
        color: '#333',
        marginBottom: 20,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        backgroundColor: "#fff",
        fontSize: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 8,
        color: '#333',
        marginBottom: 20,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});


export default Home;