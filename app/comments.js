import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';

const CommentList = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWZmZjQ3YzVkMmE3ZTBkMjg1Mzg5NmZkOTA2ZDg5NyIsInN1YiI6IjYyM2VmZmU3NWE5OTE1MDA0ODM3NGI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I8YbLEsEEJUptEN3QKI5hTaMSE_uAayk29jYJviGrD8'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        // Inicializar todos los comentarios como no expandidos
        const initialExpandedComments = {};
        data.results.forEach(comment => {
          initialExpandedComments[comment.id] = false;
        });
        setExpandedComments(initialExpandedComments);
        setData(data.results);
      } catch (error) {
        console.error('Error:', error);
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

  const handleAddComment = () => {
    // Crear el nuevo comentario
    const newCommentData = {
      author: "me",
      author_details: {
        name: "",
        username: "me",
        avatar_path: "/eZ86AtmtHSNnCeHKztYEEgxaGcN.jpg",
        rating: 4
      },
      content: newComment // El contenido del comentario es el texto del input
    };
    // Agregar el nuevo comentario al estado data
    setData(prevData => [...prevData, newCommentData]);
    
    // Limpiar el input después de agregar el comentario
    setNewComment('');
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image
        source={{
          uri:
            item.author_details.avatar_path
              ? "https://media.themoviedb.org/t/p/w90_and_h90_face" +
                item.author_details.avatar_path
              : "https://cdn-icons-png.flaticon.com/128/552/552721.png",
        }}
        style={styles.profilePicture}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.author}</Text>
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
    backgroundColor: '#FFF',
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
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default CommentList;
