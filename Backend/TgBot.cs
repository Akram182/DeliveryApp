using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using static System.Console;

namespace Backend
{

    public class TgBot
    {
        TelegramBotClient bot = new TelegramBotClient("7859472632:AAGSjt0P62nVDe6lAWAeiveUobqQNjGf14w");
        List<long> EmployersUserID = new List<long>();
        List<long> AdminsUserId = new List<long>();

        string uniqueKey = "Ghallo10#20+5";

        public void Start()
        {
            var me = bot.GetMe();


            bot.OnMessage += AnswerToUser;
            bot.OnUpdate += HandleUpdate;

            //bot.SendMessage(5276251986,"Проверка Отправки заказов");
            //bot.SendMessage(5276251986, "Проверка Отправки заказов2");
            //bot.SendMessage(5276251986, "Проверка Отправки заказов3");

            WriteLine("Started");
        }

        private async Task HandleUpdate(Update update)
        {

            if (update.Type == UpdateType.CallbackQuery)
            {
                var callBack = update.CallbackQuery!;
                if (callBack.Data == "makeKurier")
                {
                    if (!EmployersUserID.Contains(callBack.Message.From.Id))
                    {
                        EmployersUserID.Add(callBack.Message.From.Id);

                        await bot.AnswerCallbackQuery(callBack.Id, $"Congratulations");
                        await bot.SendMessage(callBack.Message.Chat.Id, $"Поздравляем вы теперь курьер ждите заказа!");
                    }
                }
                if (callBack.Data == "makeAdmin")
                {
                    await bot.AnswerCallbackQuery(callBack.Id, $"Enter Data");
                    await bot.SendMessage(callBack.Message.Chat.Id, "Введите Unique Key:");
                }

                //Create Dictionary To save userState e.x:userId,"WaitingFor login"
                //if (callBack.Message.Text == uniqueKey)
                //{
                //    WriteLine("Попытка админа");
                //    AdminsUserId.Add(callBack.Message.From.Id);
                //    WriteLine("админ доб");
                //    await bot.AnswerCallbackQuery(callBack.Id, "Call Inline");
                //    WriteLine("ответ послаy");
                //    await bot.SendMessage(callBack.Message.Chat.Id, "Вы теперь Админ");
                //}
            }
        }

        private async Task AnswerToUser(Message message, UpdateType update)
        {
            if (message.Text != null)
            {
                if (message.Text == "/start")
                {
                    await bot.SendMessage(message.Chat.Id, "Вы хотите стать курьеровм?",
                        replyMarkup: new InlineKeyboardMarkup(
                            new[]{
                                new[]{
                                    InlineKeyboardButton.WithCallbackData("Да,Хочу","makeKurier"),
                                    InlineKeyboardButton.WithCallbackData("Админ","makeAdmin")
                                }
                            })
                        );

                }
            }

            if (message.Text == "/allEmp")
            {
                if (AdminsUserId.Contains(message.From.Id))
                {
                    foreach (long empId in EmployersUserID)
                    {
                        await bot.SendMessage(empId, "Alert");
                    }
                }
                else
                {
                    await bot.SendMessage(message.From.Id, "Вы не админ",
                        replyMarkup: new InlineKeyboardMarkup(
                            new[] {
                                new[]{
                                    InlineKeyboardButton.WithCallbackData("Стать админом","makeAdmin"),
                                }
                            })
                        );

                }

            }
            else
            {
                WriteLine($"Message Id:{message.Id}\nMessage Text:{message.Text}\nMessage Chat Id:{message.Chat.Id}\nMessage Chat:{message.Chat}\nMessage Chat UserName:{message.Chat.Username}\nMessage Chat fIRSTnAME:{message.Chat.FirstName}\nMessage form LastName:{message.From.LastName} and {message.From.Username} and {message.From.FirstName}");

                await bot.SendMessage(
                    message.Chat.Id,
                    text: message.Text,
                    replyMarkup: new InlineKeyboardMarkup(
                        new[]{
                                new[]
                                {
                                    InlineKeyboardButton.WithCallbackData("Кнопка 1", "data1"),
                                    InlineKeyboardButton.WithCallbackData("Кнопка 2", "data2")
                                },
                                new[]{
                                    InlineKeyboardButton.WithCallbackData("Burron 3","3")
                                }
                        })
                    );

            }

        }
    }


}

