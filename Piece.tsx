import { Chess } from "chess.js";
import React, { useCallback } from "react";
import { StyleSheet, Image, View } from "react-native";

import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from "react-native-gesture-handler";

import { Vector } from "react-native-redash";

import { toTranslation, SIZE, toPosition, Position } from "./Notation";
import { AnimatedView } from "react-native-reanimated/lib/typescript/reanimated2/component/View";

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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  piece: {
    width: SIZE,
    height: SIZE,
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginBottom: 30,
  },
});

interface PieceProps {
  id: Piece;
  startPosition: Vector;
  chess: Chess;
  onTurn: () => void;
  enabled: boolean;
}
var num = 1;
const Piece = ({ id, startPosition, chess, onTurn, enabled }: PieceProps) => {
  const isGestureActive = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(startPosition.x * SIZE);
  const translateY = useSharedValue(startPosition.y * SIZE);
  // console.log(`${startPosition.x} => SX`)
  // console.log(`${startPosition.y} => SY`)
  const movePiece = useCallback(
    (to: Position) => {
      const moves = chess.moves({ verbose: true });
      const from = toPosition({ x: offsetX.value, y: offsetY.value });
      const move = moves.find((m) => m.from === from && m.to === to);
      const { x, y } = toTranslation(move ? move.to : from);
      translateX.value = withTiming(
        x,
        {},
        () => (offsetX.value = translateX.value)
      );
      translateY.value = withTiming(y, {}, () => {
        offsetY.value = translateY.value;
        isGestureActive.value = false;
      });
      if (move) {
        chess.move({ from, to });
        onTurn();
      }
    },
    [chess, isGestureActive, offsetX, offsetY, onTurn, translateX, translateY]
  );

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      console.log('Single tap!');
    });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      console.log('Double tap!');
    });

  // const onGestureEvent = useAnimatedGestureHandler<
  //   PanGestureHandlerGestureEvent
  // >({
  //   onStart: () => {
  //     offsetX.value = translateX.value;
  //     offsetY.value = translateY.value;
  //     isGestureActive.value = true;
  //   },
  //   onActive: ({ translationX, translationY }) => {
  //     translateX.value = translationX + offsetX.value;
  //     translateY.value = translationY + offsetY.value;
  //   },
  //   onEnd: () => {
  //     runOnJS(movePiece)(
  //       toPosition({ x: translateX.value, y: translateY.value })
  //     );
  //   },
  // });

  // const original = useAnimatedStyle(() => {
  //   return {
  //     position: "absolute",
  //     width: SIZE,
  //     height: SIZE,
  //     zIndex: 0,
  //     backgroundColor: isGestureActive.value
  //       ? "rgba(255, 255, 0, 0.5)"
  //       : "transparent",
  //     transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  //   };
  // });
  // const underlay = useAnimatedStyle(() => {
  //   const position = toPosition({ x: translateX.value, y: translateY.value });
  //   const translation = toTranslation(position);
  //   return {
  //     position: "absolute",
  //     width: SIZE,
  //     height: SIZE,
  //     zIndex: 0,
  //     backgroundColor: isGestureActive.value
  //       ? "rgba(255, 255, 0, 0.5)"
  //       : "transparent",
  //     transform: [{ translateX: translation.x }, { translateY: translation.y }],
  //   };
  // });
  // console.log(`${translateX.value} => M`)
  // console.log(`${translateY.value} => N`)

  const tmpStyle = useAnimatedStyle(() => ({
    position: "absolute",
    // zIndex: isGestureActive.value ? 100 : 10,
    width: SIZE,
    height: SIZE,
    transform: [{ translateX: startPosition.x }, { translateY: startPosition.y },],
  }));

  return (
    <>
      <GestureHandlerRootView style={{ position: "absolute", }}>
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
          {/* <Animated.View style={tmpStyle}>
            <Image source={PIECES[id]} style={styles.piece} />
          </Animated.View> */}
          <View style={styles.box} />
        </GestureDetector>
      </GestureHandlerRootView>

      {/* <Animated.View style={underlay}/>
    <Animated.View style={original}/> */}
      {/* <GestureHandlerRootView style={{ position: "absolute", }}> */}
        {/* <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}> */}
        {/* <Animated.View style={tmpStyle}>
            <Image source={PIECES[id]} style={styles.piece} />
          </Animated.View> */}
        {/* </GestureDetector> */}
        {/* <PanGestureHandler onGestureEvent={onGestureEvent} enabled={enabled}>
          <Animated.View style={tmpStyle}>
            <Image source={PIECES[id]} style={styles.piece} />
          </Animated.View>
        </PanGestureHandler> */}
      {/* </GestureHandlerRootView> */}
    </>
  );
};

export default Piece;

