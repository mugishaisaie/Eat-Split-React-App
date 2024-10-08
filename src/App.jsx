import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({children,onclick}){
  return <button className="button" onClick={onclick}>{children}</button>
}


export default function App(){
  const [showAddFriend,setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend(){
    setShowAddFriend(showAddFriend=>!showAddFriend)
  }

  function handleAddFriend(friend){
    console.log(friend)
    setFriends(friends=>[...friends,friend])
  }

  function handleSelection(friend){
    setSelectedFriend((curFriend)=> (curFriend?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }

  function handleSplitBill(value){
    console.log(value)
    setFriends((friends) =>friends.map((friend)=> friend.id === selectedFriend.id? {...friend, balance: friend.balance + value}: friend) )

  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends}
         handleSelection={handleSelection} 
         selectedFriend={selectedFriend}/>

        {showAddFriend && <FormAddFriend handleAddFriend={handleAddFriend}/>}

        <Button onclick={handleShowAddFriend}>{showAddFriend? 'Close': 'Add Friend'}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} handleSplitBill={handleSplitBill}/>}
     
    </div>
  );
}

function FriendList({friends,handleSelection,selectedFriend}){
  

  return (
    <ul>
      {friends.map((friend)=> <Friend key={friend.id} friend={friend}
       handleSelection={handleSelection} 
       selectedFriend={selectedFriend}/>)}
    </ul>
  )
}

function Friend({friend,handleSelection,selectedFriend}){
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected? 'selected': ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance <0 && <p className="red">You Owe{friend.name} ${friend.balance}</p>}
      {friend.balance > 0 && <p className="green">{friend.name} Owes You ${friend.balance}</p>}
      {friend.balance === 0 && <p>You and {friend.name} are Even</p>}
      <Button onclick={()=>handleSelection(friend)}>{isSelected? 'Close':'Selected'}</Button>
    </li>
  )
}


function FormAddFriend({handleAddFriend}){
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleFormAddFriend(e) {
    e.preventDefault();
    if(!name || !image) return;

    const id= crypto.randomUUID();
    const newFriend ={
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
  
    }
    // console.log(newFriend)
    handleAddFriend(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48');

  }

  return(

    <form className="form-add-friend" onSubmit={handleFormAddFriend}>
      <label htmlFor="">Friend Name🧑‍🤝‍🧑</label>
      <input type="text" placeholder="Friend's Name" value={name} onChange={e=>setName(e.target.value)} />
      <label htmlFor="">🖼️Image URL</label>
      <input type="text" placeholder="Friend's Image URL"  value={image} onChange={e=>setImage(e.target.value)}/>
     <Button>Add Friend</Button>
    </form>
  )
}

function FormSplitBill({selectedFriend, handleSplitBill}){
  const [bill, setBill] =useState('')
  const [paidByUser, setPaidByUser] =useState('')
  const paidByFriend = bill? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] =useState('user')
  // 
  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByUser) return;

    handleSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)

  }

  // 
  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a Bill With {selectedFriend.name}</h2>
    <label htmlFor="">💰Bill Value </label>
      <input type="text" value={bill} onChange={e=>setBill(Number(e.target.value))} />
      <label htmlFor="">👨‍🦰 Your Expenses </label>
      <input type="text" value={paidByUser}
       onChange={e=>setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}/>
      <label htmlFor=""> 🧑‍🤝‍🧑 {selectedFriend.name}'s Expenses</label>
      <input type="text" value={paidByFriend}disabled />
      <label htmlFor="">💵 Who's Paying The Bill</label>
      <select value={whoIsPaying} onChange={e=>setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
  </form>
}