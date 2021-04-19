import {
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    Alert,
    AsyncStorage,
    Button,
    DeviceEventEmitter
} from "react-native";
import React, { Component } from 'react';

export default class DetailsView extends React.Component {

    componentDidMount() {

    }
    constructor(props) {
        super(props)

        this.state = {
            msgText: '',
            tag: 0
        }

    }
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <TextInput
                    style={styles.textInputStyle}
                    multiline={true}  // 代表可以输入多行
                    defaultValue={this.props.route.params.content ? this.props.route.params.content : this.state.text}
                    //value={navigation.getParam('content', '') ? navigation.getParam('content', '') : this.state.text}
                    placeholder="输入文本"
                    onChangeText={(text) => {
                        this.setState({ tag: 1 })
                        this.setState({ msgText: text });
                    }}
                />
                <Button title="保存" color={'red'} onPress={() => {

                    if (this.props.route.params.stas === "create") {
                        this.props.route.params.createTag("create");
                    } else if (this.props.route.params.stas === "update") {
                        const stas = this.props.route.params.stas;
                        const idx = this.props.route.params.idx;
                        const allary = [{ tepSta: stas }, { temIdx: idx }]
                        this.props.route.params.updateTag(allary);
                    }
                    if (this.state.msgText === '') {
                        if (this.state.tag === 0) {
                            this._setMessage(this.props.route.params.content)
                        } else {
                            this._setMessage({ 'content': this.state.msgText })
                        }
                    } else {
                        this._setMessage(this.state.msgText)
                    }

                    navigation.goBack();
                }}>

                </Button>
            </View >
        );
    }
    //保存信息
    _setMessage(message) {
        AsyncStorage.setItem('content', message, (error) => {
            if (error) {

            } else {
                // alert('保存OK');
            }
        });
        DeviceEventEmitter.emit('notic', "message");
    }
}




const styles = StyleSheet.create({
    textInputStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        fontSize: 15
    },
});