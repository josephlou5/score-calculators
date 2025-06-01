import { metadataForPage } from "../metadata";
import { TicketToRideScoreSheet } from "./scoreSheet";

export const metadata = metadataForPage("Ticket to Ride");

const BOARD_GAME_GEEK_LINK =
  "https://boardgamegeek.com/boardgame/9209/ticket-to-ride";
const RULES_LINK =
  "https://cdn.1j1ju.com/medias/2c/f9/7f-ticket-to-ride-rulebook.pdf";

/** Score calculator for the game "Ticket to Ride". */
export default function Page() {
  return (
    <>
      <div className="h1">Ticket to Ride</div>
      <div className="mb-2">
        Link:{" "}
        <a href={BOARD_GAME_GEEK_LINK} target="_blank">
          {BOARD_GAME_GEEK_LINK}
        </a>
      </div>
      <div className="mb-2">
        Rules:{" "}
        <a href={RULES_LINK} target="_blank">
          {RULES_LINK}
        </a>
      </div>
      <div className="fst-italic mb-2">
        Note: This page only accounts for the base version of the game with the
        U.S. map.
      </div>

      <TicketToRideScoreSheet />
    </>
  );
}
