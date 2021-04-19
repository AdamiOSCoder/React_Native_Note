import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
    Button,
    Alert,
    FlatList,
    AsyncStorage,
    DeviceEventEmitter,
    Dimensions
} from "react-native";

import { Pxwh } from "../tools/Pxwh"

export default function ListItem({ content, color, time, onPress, idx, thisz }) {
    return (
        <>
            <TouchableOpacity
                onPress={onPress} style={[styles.wrapper, { backgroundColor: color }]}>
                <Text style={styles.content}>{content}</Text>
            </TouchableOpacity>
            <View style={styles.btnView} >
                <Button title="削除" onPress={() => {
                    thisz.state.data.splice(idx, 1);
                    thisz.setState({ data: thisz.state.data })
                }} />
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: Pxwh(150),
        backgroundColor: '#def2ff',
        margin: Pxwh(20),
        borderRadius: Pxwh(10),
        justifyContent: 'center',
        padding: Pxwh(15),
    },
    content: {
        fontSize: Pxwh(30),
        paddingRight: 40
    },
    btnView: {
        position: 'absolute',
        right: 15,
        top: 35,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        width: Dimensions.get('window').width - 100
    },
});