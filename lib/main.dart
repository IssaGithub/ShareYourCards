import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const ShareYourCardsApp());
}

class ShareYourCardsApp extends StatelessWidget {
  const ShareYourCardsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShareYourCards',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const CardListScreen(),
    );
  }
}

class CardListScreen extends StatefulWidget {
  const CardListScreen({super.key});

  @override
  State<CardListScreen> createState() => _CardListScreenState();
}

class _CardListScreenState extends State<CardListScreen> {
  final CardRepository _repository = const CardRepository();
  final TextEditingController _searchController = TextEditingController();

  List<BusinessCard> _cards = <BusinessCard>[];
  bool _isLoading = true;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _loadCards();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadCards() async {
    try {
      final List<BusinessCard> loadedCards = await _repository.loadCards();
      if (!mounted) {
        return;
      }
      setState(() {
        _cards = loadedCards;
        _isLoading = false;
      });
    } catch (_) {
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
      });
      _showMessage('Karten konnten nicht geladen werden.');
    }
  }

  Future<void> _persistCards(List<BusinessCard> nextCards) async {
    setState(() {
      _cards = nextCards;
    });
    await _repository.saveCards(nextCards);
  }

  List<BusinessCard> get _filteredCards {
    final String normalizedQuery = _query.trim().toLowerCase();
    if (normalizedQuery.isEmpty) {
      return _cards;
    }
    return _cards.where((BusinessCard card) {
      return card.searchText.contains(normalizedQuery);
    }).toList();
  }

  Future<void> _createCard() async {
    final BusinessCard? newCard = await Navigator.of(context).push<BusinessCard>(
      MaterialPageRoute<BusinessCard>(
        builder: (_) => const EditCardScreen(),
      ),
    );
    if (newCard == null) {
      return;
    }

    final List<BusinessCard> next = <BusinessCard>[newCard, ..._cards];
    await _persistCards(next);
    _showMessage('Karte hinzugefügt.');
  }

  Future<void> _openCard(BusinessCard card) async {
    final CardDetailResult? result =
        await Navigator.of(context).push<CardDetailResult>(
      MaterialPageRoute<CardDetailResult>(
        builder: (_) => CardDetailScreen(card: card),
      ),
    );

    if (result == null) {
      return;
    }

    if (result.updatedCard != null) {
      final List<BusinessCard> updatedCards = _cards
          .map((BusinessCard existing) =>
              existing.id == result.updatedCard!.id
                  ? result.updatedCard!
                  : existing)
          .toList();
      await _persistCards(updatedCards);
      _showMessage('Karte aktualisiert.');
      return;
    }

    if (result.deletedCardId != null) {
      final List<BusinessCard> updatedCards = _cards
          .where((BusinessCard existing) => existing.id != result.deletedCardId)
          .toList();
      await _persistCards(updatedCards);
      _showMessage('Karte gelöscht.');
    }
  }

  Future<bool> _confirmDelete(BusinessCard card) async {
    final bool? shouldDelete = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Karte löschen?'),
          content: Text('Möchtest du ${card.name} wirklich entfernen?'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Abbrechen'),
            ),
            FilledButton.tonal(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Löschen'),
            ),
          ],
        );
      },
    );
    return shouldDelete ?? false;
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final List<BusinessCard> cards = _filteredCards;

    return Scaffold(
      appBar: AppBar(
        title: const Text('ShareYourCards'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createCard,
        icon: const Icon(Icons.add),
        label: const Text('Karte hinzufügen'),
      ),
      body: SafeArea(
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
              child: TextField(
                controller: _searchController,
                decoration: const InputDecoration(
                  hintText: 'Name, Firma, Position, E-Mail oder Telefon',
                  prefixIcon: Icon(Icons.search),
                  border: OutlineInputBorder(),
                ),
                onChanged: (String value) {
                  setState(() {
                    _query = value;
                  });
                },
              ),
            ),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : cards.isEmpty
                      ? const _EmptyState()
                      : ListView.builder(
                          itemCount: cards.length,
                          itemBuilder: (BuildContext context, int index) {
                            final BusinessCard card = cards[index];
                            return Dismissible(
                              key: ValueKey<String>(card.id),
                              direction: DismissDirection.endToStart,
                              background: Container(
                                color: Colors.red.shade700,
                                alignment: Alignment.centerRight,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24,
                                ),
                                child: const Icon(
                                  Icons.delete_forever,
                                  color: Colors.white,
                                ),
                              ),
                              confirmDismiss: (_) => _confirmDelete(card),
                              onDismissed: (_) async {
                                final List<BusinessCard> next = _cards
                                    .where((BusinessCard existing) =>
                                        existing.id != card.id)
                                    .toList();
                                await _persistCards(next);
                                _showMessage('Karte gelöscht.');
                              },
                              child: ListTile(
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 18,
                                  vertical: 8,
                                ),
                                leading: CircleAvatar(
                                  child: Text(card.initials),
                                ),
                                title: Text(
                                  card.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                subtitle: Text(
                                  '${card.company} • ${card.role}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                trailing: const Icon(Icons.chevron_right),
                                onTap: () => _openCard(card),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: const <Widget>[
            Icon(Icons.badge_outlined, size: 56),
            SizedBox(height: 12),
            Text(
              'Noch keine Visitenkarten vorhanden.\n'
              'Lege direkt deine erste Karte an.',
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class CardDetailScreen extends StatelessWidget {
  const CardDetailScreen({required this.card, super.key});

  final BusinessCard card;

  Future<void> _shareCardAsText() async {
    await SharePlus.instance.share(
      ShareParams(
        text: card.toShareText(),
        subject: 'Digitale Visitenkarte: ${card.name}',
      ),
    );
  }

  Future<void> _shareCardAsVcard() async {
    await SharePlus.instance.share(
      ShareParams(
        text: card.toVcard(),
        subject: 'vCard: ${card.name}',
      ),
    );
  }

  Future<void> _edit(BuildContext context) async {
    final BusinessCard? editedCard = await Navigator.of(context).push<BusinessCard>(
      MaterialPageRoute<BusinessCard>(
        builder: (_) => EditCardScreen(initialCard: card),
      ),
    );

    if (!context.mounted || editedCard == null) {
      return;
    }

    Navigator.of(context).pop(CardDetailResult.updated(editedCard));
  }

  Future<void> _delete(BuildContext context) async {
    final bool? shouldDelete = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Karte löschen?'),
          content: Text('Möchtest du ${card.name} wirklich löschen?'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Abbrechen'),
            ),
            FilledButton.tonal(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Löschen'),
            ),
          ],
        );
      },
    );

    if (!context.mounted || shouldDelete != true) {
      return;
    }

    Navigator.of(context).pop(CardDetailResult.deleted(card.id));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartendetails'),
        actions: <Widget>[
          IconButton(
            tooltip: 'Bearbeiten',
            onPressed: () => _edit(context),
            icon: const Icon(Icons.edit),
          ),
          IconButton(
            tooltip: 'Löschen',
            onPressed: () => _delete(context),
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: <Widget>[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    card.name,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${card.role} bei ${card.company}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const Divider(height: 28),
                  _DetailRow(label: 'E-Mail', value: card.email),
                  _DetailRow(label: 'Telefon', value: card.phone),
                  _DetailRow(label: 'Website', value: card.website),
                  _DetailRow(label: 'Notiz', value: card.note),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          FilledButton.icon(
            onPressed: _shareCardAsText,
            icon: const Icon(Icons.share),
            label: const Text('Als Kontakttext teilen'),
          ),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: _shareCardAsVcard,
            icon: const Icon(Icons.qr_code_2),
            label: const Text('Als vCard teilen'),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            label,
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 2),
          Text(value.isEmpty ? '-' : value),
        ],
      ),
    );
  }
}

class EditCardScreen extends StatefulWidget {
  const EditCardScreen({this.initialCard, super.key});

  final BusinessCard? initialCard;

  @override
  State<EditCardScreen> createState() => _EditCardScreenState();
}

class _EditCardScreenState extends State<EditCardScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _companyController;
  late final TextEditingController _roleController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  late final TextEditingController _websiteController;
  late final TextEditingController _noteController;

  @override
  void initState() {
    super.initState();
    final BusinessCard? initial = widget.initialCard;
    _nameController = TextEditingController(text: initial?.name ?? '');
    _companyController = TextEditingController(text: initial?.company ?? '');
    _roleController = TextEditingController(text: initial?.role ?? '');
    _emailController = TextEditingController(text: initial?.email ?? '');
    _phoneController = TextEditingController(text: initial?.phone ?? '');
    _websiteController = TextEditingController(text: initial?.website ?? '');
    _noteController = TextEditingController(text: initial?.note ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _companyController.dispose();
    _roleController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _websiteController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _submit() {
    final bool isValid = _formKey.currentState?.validate() ?? false;
    if (!isValid) {
      return;
    }

    final BusinessCard card = BusinessCard(
      id: widget.initialCard?.id ??
          DateTime.now().microsecondsSinceEpoch.toString(),
      name: _nameController.text.trim(),
      company: _companyController.text.trim(),
      role: _roleController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      website: _websiteController.text.trim(),
      note: _noteController.text.trim(),
    );

    Navigator.of(context).pop(card);
  }

  String? _validateRequired(String? value, String label) {
    if (value == null || value.trim().isEmpty) {
      return '$label ist erforderlich.';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    final String trimmed = value?.trim() ?? '';
    if (trimmed.isEmpty) {
      return null;
    }
    final RegExp pattern = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    if (!pattern.hasMatch(trimmed)) {
      return 'Bitte eine gültige E-Mail eingeben.';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final bool isEdit = widget.initialCard != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEdit ? 'Karte bearbeiten' : 'Neue Karte'),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Name *',
                  border: OutlineInputBorder(),
                ),
                validator: (String? value) => _validateRequired(value, 'Name'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _companyController,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Firma *',
                  border: OutlineInputBorder(),
                ),
                validator: (String? value) => _validateRequired(value, 'Firma'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _roleController,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Position *',
                  border: OutlineInputBorder(),
                ),
                validator: (String? value) =>
                    _validateRequired(value, 'Position'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'E-Mail',
                  border: OutlineInputBorder(),
                ),
                validator: _validateEmail,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Telefon',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _websiteController,
                keyboardType: TextInputType.url,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Website',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _noteController,
                minLines: 3,
                maxLines: 5,
                decoration: const InputDecoration(
                  labelText: 'Notiz',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 18),
              FilledButton.icon(
                onPressed: _submit,
                icon: const Icon(Icons.save_outlined),
                label: Text(isEdit ? 'Änderungen speichern' : 'Karte speichern'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class CardDetailResult {
  const CardDetailResult.updated(this.updatedCard) : deletedCardId = null;
  const CardDetailResult.deleted(this.deletedCardId) : updatedCard = null;

  final BusinessCard? updatedCard;
  final String? deletedCardId;
}

class CardRepository {
  const CardRepository();

  static const String _storageKey = 'network_business_cards_v1';

  Future<List<BusinessCard>> loadCards() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? raw = prefs.getString(_storageKey);

    if (raw == null || raw.trim().isEmpty) {
      final List<BusinessCard> defaults = BusinessCard.defaults;
      await saveCards(defaults);
      return defaults;
    }

    final List<dynamic> decoded = jsonDecode(raw) as List<dynamic>;
    return decoded
        .map((dynamic json) =>
            BusinessCard.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<void> saveCards(List<BusinessCard> cards) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String payload = jsonEncode(
      cards.map((BusinessCard card) => card.toJson()).toList(),
    );
    await prefs.setString(_storageKey, payload);
  }
}

class BusinessCard {
  const BusinessCard({
    required this.id,
    required this.name,
    required this.company,
    required this.role,
    required this.email,
    required this.phone,
    required this.website,
    required this.note,
  });

  final String id;
  final String name;
  final String company;
  final String role;
  final String email;
  final String phone;
  final String website;
  final String note;

  String get initials {
    final List<String> parts = name
        .trim()
        .split(RegExp(r'\s+'))
        .where((String part) => part.isNotEmpty)
        .toList();
    if (parts.isEmpty) {
      return '?';
    }
    if (parts.length == 1) {
      return parts.first[0].toUpperCase();
    }
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  String get searchText {
    return <String>[name, company, role, email, phone, website, note]
        .join(' ')
        .toLowerCase();
  }

  String toShareText() {
    return '''
📇 Digitale Visitenkarte (Netzwerkkontakt)

$name
$role bei $company

E-Mail: ${email.isEmpty ? '-' : email}
Telefon: ${phone.isEmpty ? '-' : phone}
Website: ${website.isEmpty ? '-' : website}

${note.isEmpty ? '' : 'Notiz: $note'}
''';
  }

  String toVcard() {
    String safe(String value) => value.replaceAll('\n', r'\n');
    return '''
BEGIN:VCARD
VERSION:3.0
N:${safe(name)};;;;
FN:${safe(name)}
ORG:${safe(company)}
TITLE:${safe(role)}
EMAIL;TYPE=INTERNET:${safe(email)}
TEL;TYPE=CELL:${safe(phone)}
URL:${safe(website)}
NOTE:${safe(note)}
END:VCARD
''';
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'company': company,
      'role': role,
      'email': email,
      'phone': phone,
      'website': website,
      'note': note,
    };
  }

  factory BusinessCard.fromJson(Map<String, dynamic> json) {
    return BusinessCard(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      company: json['company'] as String? ?? '',
      role: json['role'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      website: json['website'] as String? ?? '',
      note: json['note'] as String? ?? '',
    );
  }

  static List<BusinessCard> get defaults {
    return const <BusinessCard>[
      BusinessCard(
        id: 'seed-1',
        name: 'Anna Weber',
        company: 'GreenTech Solutions',
        role: 'Head of Partnerships',
        email: 'anna.weber@greentech.example',
        phone: '+49 170 1234567',
        website: 'https://greentech.example',
        note: 'Fokus auf B2B Kooperationen im DACH-Raum.',
      ),
      BusinessCard(
        id: 'seed-2',
        name: 'Daniel Koch',
        company: 'CloudCraft GmbH',
        role: 'Senior Product Designer',
        email: 'daniel.koch@cloudcraft.example',
        phone: '+49 151 9876543',
        website: 'https://cloudcraft.example',
        note: 'Spricht auf Meetups über Design Systems.',
      ),
    ];
  }
}
