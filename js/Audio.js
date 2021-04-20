import React, { Component } from 'react';
import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
} from 'react-native';

class AudioView extends Component {

    state = {
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
        hasPermission: undefined,
    };

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });

            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({ currentTime: Math.floor(data.currentTime) });
            };

            AudioRecorder.onFinished = (data) => {
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
    }

    _renderButton(title, onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    _renderPauseButton(onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;
        var title = this.state.paused ? "再開" : "pause";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    async _pause() {
        if (!this.state.recording) {
            console.warn('pauseできない,記録しない');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({ paused: true });
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('再開できない, pausedしない');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ paused: false });
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        if (!this.state.recording) {
            console.warn('ストップできない, 記録しない');
            return;
        }

        this.setState({ stoppedRecording: true, recording: false, paused: false });

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        if (this.state.recording) {
            await this._stop();
        }
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('ファイルなし', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('okです');
                    } else {
                        console.log('エラー');
                    }
                });
            }, 100);
        }, 100);
    }

    async _record() {
        if (this.state.recording) {
            console.warn('記録完了');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('記録できません。許可がありません。');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({ recording: true, paused: false });

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.controls}>
                    {this._renderButton("記録", () => { this._record() }, this.state.recording)}
                    {this._renderButton("開始", () => { this._play() })}
                    {this._renderButton("ストップ", () => { this._stop() })}
                    {/* {this._renderButton("PAUSE", () => { this._pause() })} */}
                    {this._renderPauseButton(() => { this.state.paused ? this._resume() : this._pause() })}
                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b608a",
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    }

});

export default AudioView;
