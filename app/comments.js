import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';


const CommentList = () => {
  const { id, img } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedComments = await AsyncStorage.getItem(`comments_${id}`);
        if (cachedComments !== null) {
          setData(JSON.parse(cachedComments));
        } else {
          const url = `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`;
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
          setData(comments);
          await AsyncStorage.setItem(`comments_${id}`, JSON.stringify(comments));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchData();
  }, [id]);

  const toggleCommentExpansion = commentId => {
    setExpandedComments(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  const handleAddComment = async () => {
    try {
      const newCommentData = {
        author: "me",
        author_details: {
          name: "",
          username: "me",
          avatar_path: "/eZ86AtmtHSNnCeHKztYEEgxaGcN.jpg",
          rating: 4
        },
        content: newComment
      };
      const updatedData = [...data, newCommentData];
      setData(updatedData);
      await AsyncStorage.setItem(`comments_${id}`, JSON.stringify(updatedData));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image
        source={{
          uri:
            item.author_details.avatar_path
              ? "https://media.themoviedb.org/t/p/w90_and_h90_face" + item.author_details.avatar_path
              : "https://cdn-icons-png.flaticon.com/128/552/552721.png",
        }}
        style={styles.profilePicture}
      />
      <View style={styles.commentContent}>
        <View style={styles.authorContainer}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(item.author_details.rating)].map((_, index) => (
              <Entypo key={index} name="star-outlined" size={24} color="gold" />
            ))}
            <Text style={{color:"white",marginLeft:6,marginTop:2,fontSize:18}}>{item.author_details.rating}</Text>
          </View>

        </View>
        <TouchableOpacity onPress={() => toggleCommentExpansion(item.id)}>
          <Text style={styles.commentText}>
            {expandedComments[item.id] ? item.content : truncateText(item.content, 80)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>


  );

  const truncateText = (text, maxLength) => {
    if (!text) return ''; // Manejar caso cuando el texto es undefined
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: img }}
        style={[StyleSheet.absoluteFill]}
        resizeMode="cover"
        blurRadius={2} // Opcional: Agrega desenfoque a la imagen de fondo
      />
      {/* Superposición semitransparente */}
      <View style={styles.overlay} />
      {data === null ? (
        <Text style={styles.noCommentsText}>No hay comentarios disponibles</Text>
      ) : (
        <>
          <FlatList
            data={data}
            renderItem={renderCommentItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
          />
          <TextInput
            style={styles.input}
            placeholder="Agregar comentario..."
            value={newComment}
            onChangeText={text => setNewComment(text)}
            onSubmitEditing={handleAddComment}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver a Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Color oscuro con opacidad del 50%
  },
  ratingContainer: {
    flexDirection: 'row', // Para mostrar las estrellas horizontalmente
    alignItems: 'center', // Alinea los elementos verticalmente
  },  
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 1,
    color: "black"
  },
  commentText: {
    fontSize: 16,
    color: "white"
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
    backgroundColor: "black",
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "white",
  },
});

export default CommentList;
