import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resumeRouter from "./resume";
import profileRouter from "./profile";
import jobsRouter from "./jobs";
import embeddingsRouter from "./embeddings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resumeRouter);
router.use(profileRouter);
router.use(jobsRouter);
router.use(embeddingsRouter);

export default router;
