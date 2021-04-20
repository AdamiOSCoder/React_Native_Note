import React, { Component } from 'react';
import { color } from 'react-native-reanimated';
import ListItem from './component/ListItem';
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

const data = [
    {
        content: 'テスト１',
    },
    {
        content: 'テスト2',
    },
];

const colorSet = ['#def2ff', '#bfeabe', '#f2d8c6', '#f0efb0', '#f0abb0', '#fccbb0', '#f8abb0', '#f99bb0', '#f8a990', '#f888b0'];
export default class ListView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: data,
            updateTag: [],
            createTag: '',
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('notic', (message) => {
            this._getMsg();
        })
    }

    componentWillUnmount() {
        //移除监听
        if (this.listener) {
            this.listener.remove();
        }
    }

    _getMsg() {
        AsyncStorage.getItem('content', (error, result) => {
            if (error) {
                alert(error);
            } else {
                const tempArray = this.state.updateTag;
                const crtTag = this.state.createTag;
                if (tempArray.length > 0) {
                    if (tempArray[0].tepSta === "update") {
                        const tempIndex = tempArray[1].temIdx
                        this.setState({
                            data: this.state.data.map((item, index) => index == tempIndex ? {
                                ...item, ["content"]: result
                            } : item)
                        })
                    }
                    this.setState({ updateTag: [] })
                } else {
                    if (crtTag === "create") {
                        this.setState({ data: [{ "content": result }, ...this.state.data] })
                    }
                }
            }
        });
    }
    render() {
        const renderItem = ({ item, index }) => (
            <ListItem content={item.content}
                color={colorSet[index]}
                time={item.time || ''}
                idx={index}
                thisz={this}
                onPress={() => {
                    this.props.navigation.navigate('Detail', {
                        "content": item.content, idx: index, "stas": "update", updateTag: (updateTag) => {
                            this.setState({ updateTag: updateTag });
                        }
                    })
                }
                }
            />
        );

        const listRowClick = () => {
            this.props.navigation.navigate('Detail', {
                "stas": "create", createTag: (createTag) => {
                    this.setState({ createTag: createTag })
                }
            })
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.flatView}>
                    <FlatList
                        data={this.state.data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    > </FlatList>
                </View>
                <TouchableOpacity style={styles.container}
                    onPress={listRowClick}>
                    <Text style={[styles.textStyle, { fontSize: 30 }]}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioView}
                    onPress={() => {
                        this.props.navigation.navigate('Audio')
                    }}>
                    <Text style={styles.textStyle}>録音</Text>
                </TouchableOpacity>
            </View >
        )
    }
}


const styles = StyleSheet.create({
    flatView: {
        flex: 1
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        borderRadius: 400,
        backgroundColor: "#bfeabe",
        width: 60,
        height: 60,
        bottom: 60,
        right: 30
    },
    audioView: {
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        borderRadius: 400,
        backgroundColor: "#bfeabe",
        width: 60,
        height: 60,
        bottom: 60,
        left: 30
    },
    textStyle: {
        color: "white",
        fontSize: 20,
    },
});