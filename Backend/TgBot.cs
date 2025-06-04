using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
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
        TelegramBotClient bot = new TelegramBotClient("");

        Dictionary<long, string> EmployersIdWState = new Dictionary<long, string>();
        Dictionary<long, string> OrdersIdWithEmp = new Dictionary<long, string>();

        List<long> AdminsUserId = new List<long>();
        string uniqueKey = "Ghallo10#20+5";



        public void Start()
        {
            var me = bot.GetMe();


            bot.OnMessage += AnswerToUser;
            bot.OnUpdate += HandleUpdate;

            WriteLine("Started");
        }

        public string CheckStatus(string id)
        {
            long emplKey = OrdersIdWithEmp.FirstOrDefault(i => i.Value == id).Key;
            if (EmployersIdWState[emplKey] == "Worker")
            {
                return "Заказ доставлен";
            }
            else if (EmployersIdWState[emplKey] == "Working")
            {
                return "Заказ собирается";
            }
            else
            {
                return "Ошибка ";
            }
        }
        public async void SendOrders(string message, string id)
        {
            var freeEmpID = EmployersIdWState.FirstOrDefault(i => i.Value == "Worker").Key;
            if (freeEmpID != 0L)
            {
                var orderSend = bot.SendMessage(freeEmpID, message, ParseMode.Html,
                    replyMarkup: new InlineKeyboardMarkup(
                        new[]
                        {
                            new[]
                            {
                                InlineKeyboardButton.WithCallbackData("Доставлен","OrderDelivered")
                            }
                    }));

                EmployersIdWState[freeEmpID] = "Working";
                OrdersIdWithEmp.Add(freeEmpID, id);

                await orderSend;
                WriteLine($"{freeEmpID} получил заказ");

            }
        }

        private async Task HandleUpdate(Update update)
        {

            if (update.Type == UpdateType.CallbackQuery)
            {

                var callBack = update.CallbackQuery!;
                if (callBack.Data == "makeKurier")
                {
                    if (!EmployersIdWState.Keys.Contains(callBack.Message.From.Id))
                    {
                        EmployersIdWState.Add(callBack.Message.Chat.Id, "Worker");

                        await bot.AnswerCallbackQuery(callBack.Id, $"Congratulations");
                        await bot.SendMessage(callBack.Message.Chat.Id, $"Поздравляем вы теперь курьер ждите заказа!");
                    }
                }

                if (callBack.Data == "makeAdmin")
                {
                    await bot.AnswerCallbackQuery(callBack.Id, $"Enter Data");
                    await bot.SendMessage(callBack.Message.Chat.Id, "Введите Unique Key:");
                }

                if (callBack.Data == "OrderDelivered")
                {
                    await bot.AnswerCallbackQuery(callBack.Id, "Спасибо за работу");
                    string orderStatus = OrdersIdWithEmp.FirstOrDefault(k => k.Key == callBack.Message.Chat.Id).Value;
                    EmployersIdWState[callBack.Message.Chat.Id] = "Worker";


                    WriteLine(orderStatus);
                    WriteLine("OrderDelivered");
                }

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
                    foreach (long empId in OrdersIdWithEmp.Keys)
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

        }
    }


}

