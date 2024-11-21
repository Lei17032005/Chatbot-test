import { addKeyword, EVENTS } from "@builderbot/bot";
import { Registrado } from "./Registrado";

const FlowInitial = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { state, gotoFlow }) => {
    if (ctx.from != "593961053773") {
      return;
    }
    const nombre = await state.get("name");
    if (nombre) {
      return gotoFlow(Registrado);
    }
  })
  .addAnswer(
    "Hola, bienvenido a BuilderBot!, por favor ingrese tu nombre",
    {
      capture: true,
    },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      const RespuestaUser = ctx.body;
      await state.update({ name: RespuestaUser });

      await flowDynamic("Te tengo visto: " + RespuestaUser);

      return gotoFlow(Registrado);
    }
  );

export { FlowInitial };
