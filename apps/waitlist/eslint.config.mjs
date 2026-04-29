import nextjsConfig from "@workspace/eslint-config/nextjs";

const eslintConfig = [
  ...nextjsConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
