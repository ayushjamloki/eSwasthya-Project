# from transformers import AutoTokenizer, AutoModelForCausalLM
# import torch

# # Load the trained model
# model = AutoModelForCausalLM.from_pretrained("C:/Users/Dell/Desktop/model")

# # Load the tokenizer
# tokenizer = AutoTokenizer.from_pretrained("C:/Users/Dell/Desktop/model")

# # # Function to generate a response
# # def generate_response(input_text):
# #     inputs = tokenizer.encode(input_text + tokenizer.eos_token, return_tensors="pt")
# #     outputs = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id)
# #     response = tokenizer.decode(outputs[0], skip_special_tokens=True)
# #     return response


# def generate_response(input_text):
#     # Encode the input and generate the attention mask
#     inputs = tokenizer.encode(input_text + tokenizer.eos_token, return_tensors="pt")
#     attention_mask = torch.ones(inputs.shape, dtype=torch.long)  # Create an attention mask

#     # Generate the output while passing the attention mask
#     outputs = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id, attention_mask=attention_mask)
#     response = tokenizer.decode(outputs[0], skip_special_tokens=True)
#     return response


# # Sample input
# test_inputs = [
#     "I have a headache and fever and tiredness. What could it be?",
#     "I'm feeling nauseous and have stomach pain. What might I have?",

# ]

# # Generate responses for each input
# for input_text in test_inputs:
#     print(f"User: {input_text}")
#     response = generate_response(input_text)
#     print(f"Bot: {response}")

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load the trained model
model = AutoModelForCausalLM.from_pretrained("C:/Users/Dell/Desktop/model")

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained("C:/Users/Dell/Desktop/model")

# Function to generate a response
def generate_response(input_text):
    # Encode the input and generate the attention mask
    inputs = tokenizer.encode(input_text + tokenizer.eos_token, return_tensors="pt")
    attention_mask = torch.ones(inputs.shape, dtype=torch.long)  # Create an attention mask

    # Generate the output while passing the attention mask
    outputs = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id, attention_mask=attention_mask)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

# Loop to continuously take input and generate a response
while True:
    user_input = input("User: ")  # Take user input from the terminal
    if user_input.lower() == 'exit':
        print("Exiting chatbot.")
        break  # Exit the loop if the user types 'exit'
    
    response = generate_response(user_input)  # Generate response
    print(f"Bot: {response}")  # Print the bot's response


