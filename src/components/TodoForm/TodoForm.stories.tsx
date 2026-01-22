import type { Meta } from "@storybook/react";
import { TodoForm } from ".";

const meta: Meta<typeof TodoForm> = {
  title: "Components/Forms/TodoForm",
  component: TodoForm,
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-12">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    action: {
      control: false,
    },
  },
};

export default meta;

// type Story = StoryObj<typeof TodoForm>;
