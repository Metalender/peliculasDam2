import { View, Text,Linking,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';

export default function trailer() {
    const [dataTrailer, setDataTrailer] = useState([]);
    const [link, setLink] = useState(null);
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const fetchDataTrailer = async () => {
            try {

                const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWZmZjQ3YzVkMmE3ZTBkMjg1Mzg5NmZkOTA2ZDg5NyIsInN1YiI6IjYyM2VmZmU3NWE5OTE1MDA0ODM3NGI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I8YbLEsEEJUptEN3QKI5hTaMSE_uAayk29jYJviGrD8'
                    }
                };

                const response = await fetch(url, options);
                const responseData = await response.json();
                const comments = responseData.results;
                setDataTrailer(comments)
                // console.log(comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchData();
    }, [])

    useEffect(() => {
        data.map((item) => {
            console.log(item.name);
            if (item.name == "Official Trailer" || item.name == "Official Trailer 2") {
                console.log("join");
                setLink("https://www.youtube.com/watch?v=" + item.key)
            } else {
                console.log("offical trailer no existe");
            }
        })

    }, [data])

    const openYouTube = () => {
        if (link) {
            Linking.openURL(link);
        }
    };

    return (
        <View>
            {link && (
                <TouchableOpacity onPress={openYouTube}>
                    <Text>Ver Trailer</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}