# voiceAssistant/views.py
import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

openai.api_key = '..'  # add your API here, but notice that the model below should be matched.

# Create your views here.
# voiceAssistant/views.py

def index(request):
    return render(request, 'index.html')


@csrf_exempt
def chat_with_gpt(request):
    if request.method == 'POST':
        try:
            user_input = request.POST.get('text', '')
            # 发送请求到OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_input}],
                temperature=0.7
            )
            # 处理响应
            gpt_response = response['choices'][0]['message']['content']
            # 返回响应给前端
            return JsonResponse({
                'response': gpt_response,
                # 如果您还想返回其它信息，可以在这里添加
            })
        except openai.error.OpenAIError as e:
            print(e)
            # 如果有错误发生，返回错误信息
            return JsonResponse({'error': str(e)}, status=500)
    
    # 如果不是POST请求，返回错误
    return JsonResponse({'error': 'Invalid request'}, status=400)