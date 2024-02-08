import { Chess } from "chess.js";
import React, { useCallback, useRef, useState } from "react";// <---new
import { StyleSheet, Text, Image, View, PanResponder, Animated, Dimensions } from "react-native";//<--new
import { Vector } from "react-native-redash";

import {
    runOnJS,
    useSharedValue,
} from "react-native-reanimated";

import { toTranslation, SIZE, toPosition, Position } from "./Notation";

type Player = "b" | "w";
type Type = "q" | "r" | "n" | "b" | "k" | "p";
type Piece = `${Player}${Type}`;
type Pieces = Record<Piece, ReturnType<typeof require>>;

export const PIECES: Pieces = {
    br: require("./assets/br.png"),
    bp: require("./assets/bp.png"),
    bn: require("./assets/bn.png"),
    bb: require("./assets/bb.png"),
    bq: require("./assets/bq.png"),
    bk: require("./assets/bk.png"),
    wr: require("./assets/wr.png"),
    wn: require("./assets/wn.png"),
    wb: require("./assets/wb.png"),
    wq: require("./assets/wq.png"),
    wk: require("./assets/wk.png"),
    wp: require("./assets/wp.png"),
};

interface PieceProps {
    id: Piece;
    startPosition: Vector;
    chess: Chess;
    onTurn: () => void;
    enabled: boolean;
}

const Piece = ({ id, startPosition, chess, onTurn, enabled }: PieceProps) => {

    var pan = useState(new Animated.ValueXY())[0];
    pan.x.setValue(startPosition.x);
    pan.y.setValue(startPosition.y);

    const panResponder = useState(
        PanResponder.create({
            // onStartShouldSetPanResponder: ()=> true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: () => {
                pan.extractOffset();
            },
        }),
    )[0];

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.container, styles.piece, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
                {...panResponder.panHandlers}
            >
                <Image source={PIECES[id]} style={styles.piece} />
            </Animated.View>
        </View>
    );
};

export default Piece;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
    piece: {
        width: SIZE,
        height: SIZE,
    },
});


