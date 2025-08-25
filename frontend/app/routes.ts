import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("question", "question_page/question.tsx"),
] satisfies RouteConfig;
