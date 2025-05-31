"use client";

import { CSSProperties, FocusEvent, Fragment, useState } from "react";

import { makeClassName } from "../../utils/className";
import { countLabel } from "../../utils/pluralize";
import { NumberInput, extractIntList } from "../../utils/numberInput";

import "./style.css";

// Rules from: https://cdn.1j1ju.com/medias/2c/f9/7f-ticket-to-ride-rulebook.pdf

// Constants.
const NUM_TOTAL_TRAINS = 45;
const LONGEST_PATH_POINTS = 10;
const ROUTE_LENGTH_SCORES: RouteLengthMapping = [1, 2, 4, 7, 10, 15];
const NUM_ROUTE_LENGTHS = ROUTE_LENGTH_SCORES.length;
const MAX_ROUTE_LENGTH_VALUES = Array.from(
  { length: NUM_ROUTE_LENGTHS },
  (unused, i) => Math.floor(NUM_TOTAL_TRAINS / (i + 1))
) as RouteLengthMapping;

/**
 * A mapping of values for each route length, where the length is the index + 1.
 */
type RouteLengthMapping = [number, number, number, number, number, number];

enum RowName {
  NAME = "name-row",
  SCORE = "score-row",
  COMPLETED_DESTINATIONS = "completed-destinations-row",
  FAILED_DESTINATIONS = "failed-destinations-row",
  ROUTES_COUNT = "routes-count-row",
  TRAIN_COUNT = "train-count-row",
  LONGEST_PATH = "longest-path-row",
}

interface PlayerInfo {
  completedDestinations: number[];
  failedDestinations: number[];
  routeCounts: RouteLengthMapping;
  longestPath: number;
}

export function TicketToRideScoreSheet() {
  const [player1Info, setPlayer1Info] = useState(makePlayerInfo());
  const [player2Info, setPlayer2Info] = useState(makePlayerInfo());
  const [player3Info, setPlayer3Info] = useState(makePlayerInfo());
  const [player4Info, setPlayer4Info] = useState(makePlayerInfo());
  const [player5Info, setPlayer5Info] = useState(makePlayerInfo());

  const playerInfos = [
    player1Info,
    player2Info,
    player3Info,
    player4Info,
    player5Info,
  ];
  const setters = [
    setPlayer1Info,
    setPlayer2Info,
    setPlayer3Info,
    setPlayer4Info,
    setPlayer5Info,
  ];

  const longestPath = Math.max(
    ...playerInfos.map((playerInfo) => playerInfo.longestPath)
  );
  const pointScores = playerInfos.map((playerInfo) =>
    calculateScore(playerInfo, longestPath)
  );

  const winnerIndices: number[] = [];
  for (let i = 0; i < playerInfos.length; i++) {
    const currPlayerInfo = playerInfos[i];
    const currScore = pointScores[i];

    if (winnerIndices.length === 0) {
      if (currScore !== 0) {
        winnerIndices.push(i);
      }
      continue;
    }

    const winnerPlayerInfo = playerInfos[winnerIndices[0]];
    const winnerScore = pointScores[winnerIndices[0]];

    let foundWinner = false;
    for (const [currValue, winnerValue] of [
      // Total points.
      [currScore, winnerScore],
      // Number of completed destinations.
      [
        currPlayerInfo.completedDestinations.length,
        winnerPlayerInfo.completedDestinations.length,
      ],
      // Longest path.
      [currPlayerInfo.longestPath, winnerPlayerInfo.longestPath],
    ]) {
      if (currValue > winnerValue) {
        // The current player should win.
        foundWinner = true;
        winnerIndices.splice(0, winnerIndices.length, i);
        break;
      }
      if (currValue < winnerValue) {
        // The current player cannot win.
        foundWinner = true;
        break;
      }
    }
    if (!foundWinner) {
      // Went through all the tiebreak values and couldn't determine a winner.
      // So the current player is tied with the current winners.
      winnerIndices.push(i);
    }
  }

  return (
    <div id="score-sheet" className="mb-2">
      {[
        [RowName.NAME, "Name"],
        [RowName.SCORE, "Score"],
        [RowName.COMPLETED_DESTINATIONS, "Completed Destinations"],
        [RowName.FAILED_DESTINATIONS, "Failed Destinations"],
        ...Array.from({ length: NUM_ROUTE_LENGTHS }, (unused, i) => [
          `${i + 1} ${RowName.ROUTES_COUNT}`,
          `# Length ${i + 1} Routes`,
        ]),
        [RowName.TRAIN_COUNT, "Train Counts"],
        [RowName.LONGEST_PATH, "Longest Path"],
      ].map(([rowClass, label]) => (
        <div key={rowClass} className="label-col" style={{ gridRow: rowClass }}>
          {label}
        </div>
      ))}

      {playerInfos.map((playerInfo, index) => {
        const setPlayerInfo = setters[index];
        const playerNum = index + 1;

        function handleCompletedDestinationsBlur(
          event: FocusEvent<HTMLInputElement>
        ) {
          const values = getDestinationsList(event.currentTarget.value);
          event.currentTarget.value = values.join(", ");
          setPlayerInfo({ ...playerInfo, completedDestinations: values });
        }

        function handleFailedDestinationsBlur(
          event: FocusEvent<HTMLInputElement>
        ) {
          const values = getDestinationsList(event.currentTarget.value);
          event.currentTarget.value = values.join(", ");
          setPlayerInfo({ ...playerInfo, failedDestinations: values });
        }

        function handleRouteCountInputForLength(index: number) {
          return (value: number) => {
            const routeCounts: RouteLengthMapping = [...playerInfo.routeCounts];
            routeCounts[index] = value;
            setPlayerInfo({ ...playerInfo, routeCounts });
          };
        }

        function handleLongestPathInput(value: number) {
          setPlayerInfo({ ...playerInfo, longestPath: value });
        }

        const numTrainsUsed = sum(
          playerInfo.routeCounts.map((count, i) => count * (i + 1))
        );
        const hadLongestPath =
          longestPath > 0 && playerInfo.longestPath === longestPath;

        function gridStyle(rowClass: string): CSSProperties {
          return {
            gridRow: rowClass,
            gridColumn: `${playerNum} player-col`,
          };
        }

        return (
          <Fragment key={`player-${playerNum}`}>
            <div style={gridStyle(RowName.NAME)}>
              <input
                type="text"
                className="form-control"
                placeholder={`Player ${playerNum}`}
              />
            </div>

            <div className="fw-bold" style={gridStyle(RowName.SCORE)}>
              {pointScores[index]}
            </div>

            <div style={gridStyle(RowName.COMPLETED_DESTINATIONS)}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={playerInfo.completedDestinations.join(",")}
                  placeholder="Completed destinations"
                  onBlur={handleCompletedDestinationsBlur}
                />
                <span className="input-group-text">
                  {sum(playerInfo.completedDestinations)}
                </span>
              </div>
            </div>
            <div style={gridStyle(RowName.FAILED_DESTINATIONS)}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={playerInfo.failedDestinations.join(",")}
                  placeholder="Failed destinations"
                  onBlur={handleFailedDestinationsBlur}
                />
                <span className="input-group-text">
                  {-sum(playerInfo.failedDestinations)}
                </span>
              </div>
            </div>

            {Array.from({ length: NUM_ROUTE_LENGTHS }, (unused, i) => {
              const value = playerInfo.routeCounts[i];
              return (
                <div
                  key={`player-${playerNum}-route-length-${i + 1}`}
                  style={gridStyle(`${i + 1} ${RowName.ROUTES_COUNT}`)}
                >
                  <div className="input-group">
                    <span className="input-group-text">
                      x{ROUTE_LENGTH_SCORES[i]}
                    </span>
                    <NumberInput
                      className={makeClassName({
                        "form-control": true,
                        "is-invalid": value > MAX_ROUTE_LENGTH_VALUES[i],
                      })}
                      value={value}
                      allowNegative={false}
                      onNumberInput={handleRouteCountInputForLength(i)}
                    />
                    <span className="input-group-text">
                      {value * ROUTE_LENGTH_SCORES[i]}
                    </span>
                  </div>
                </div>
              );
            })}

            <div
              className={makeClassName({
                "text-danger": numTrainsUsed > NUM_TOTAL_TRAINS,
              })}
              style={gridStyle(RowName.TRAIN_COUNT)}
            >
              <div>{countLabel(numTrainsUsed, "train")} used</div>
              <div>
                {numTrainsUsed <= NUM_TOTAL_TRAINS
                  ? `${countLabel(
                      NUM_TOTAL_TRAINS - numTrainsUsed,
                      "train"
                    )} remaining`
                  : `(should be max ${NUM_TOTAL_TRAINS})`}
              </div>
            </div>

            <div style={gridStyle(RowName.LONGEST_PATH)}>
              <div
                className={makeClassName({
                  "input-group": true,
                  "longest-path": hadLongestPath,
                })}
              >
                <NumberInput
                  className={makeClassName({
                    "form-control": true,
                    "is-invalid": playerInfo.longestPath > numTrainsUsed,
                  })}
                  value={playerInfo.longestPath}
                  allowNegative={false}
                  onNumberInput={handleLongestPathInput}
                />
                <span
                  className={makeClassName({
                    "input-group-text": true,
                    "fw-bold": hadLongestPath,
                  })}
                >
                  {hadLongestPath ? LONGEST_PATH_POINTS : 0}
                </span>
              </div>
            </div>
          </Fragment>
        );
      })}

      {winnerIndices.map((winnerIndex) => (
        <div
          key={`player-${winnerIndex + 1}-winner`}
          className="winner-col"
          style={{
            gridRow: "1 / -1",
            gridColumn: `${winnerIndex + 1} player-col-left-side / span 3`,
          }}
        ></div>
      ))}
    </div>
  );
}

function makePlayerInfo(): PlayerInfo {
  return {
    completedDestinations: [],
    failedDestinations: [],
    routeCounts: [0, 0, 0, 0, 0, 0],
    longestPath: 0,
  };
}

function calculateScore(playerInfo: PlayerInfo, longestPath: number): number {
  const destinationsTotal =
    sum(playerInfo.completedDestinations) - sum(playerInfo.failedDestinations);
  const routesTotal = sum(
    ROUTE_LENGTH_SCORES.map((score, i) => playerInfo.routeCounts[i] * score)
  );
  // All players who have the longest path will get the points.
  const longestPathTotal =
    longestPath > 0 && playerInfo.longestPath === longestPath
      ? LONGEST_PATH_POINTS
      : 0;
  return destinationsTotal + routesTotal + longestPathTotal;
}

function getDestinationsList(str: string): number[] {
  const values = extractIntList(str, { allowNegative: false });
  values.sort((a, b) => a - b);
  // Remove '0's.
  values.splice(0, values.lastIndexOf(0) + 1);
  return values;
}

function sum(values: Array<number>): number {
  return values.reduce((total, curr) => total + curr, 0);
}
