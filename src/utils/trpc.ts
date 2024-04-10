// utils/trpc.ts

interface HelloResponse {
    data: string;
  }
  
  interface HelloWithArgsResponse {
    data: string;
  }
  
  export const trpc = {
    hello: {
      useQuery: async (): Promise<HelloResponse> => {
        // Simulate an async call (replace this with your actual API call)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: "Hello, world!" });
          }, 1000);
        });
      }
    },
    helloWithArgs: {
      useQuery: async (args: { text: string }): Promise<HelloWithArgsResponse> => {
        // Simulate an async call (replace this with your actual API call)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: `Hello, ${args.text}!` });
          }, 1000);
        });
      }
    }
  };
  